import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const peoplePath = path.join(projectRoot, 'data', 'metro-people', 'people.ts');
const outputPath = path.join(projectRoot, 'design', 'nickname-image-trials', 'trial-prompts-v2.json');

const SHARED_STYLE = [
  'Editorial still-life and landscape photography with natural material textures, restrained saturation, warm cream highlights, muted blue and sage accents, gentle contrast, and subtle fine film grain.',
  'Soft daylight, simple composition, one dominant focal subject, generous negative space.',
  'Quiet observational mood matching a photographic magazine collage.',
  'Square image with the main subject within the central 60 percent, legible as a small thumbnail and suitable for a circular crop.',
  'No text, letters, logos, watermark, collage, borders, illustration, or 3D-rendered appearance.',
].join(' ');

const colorWords = ['warm ivory', 'muted sage', 'soft stone gray', 'pale sky blue', 'beige linen', 'dusty cream'];
const surfaces = ['matte paper', 'linen cloth', 'light plaster surface', 'smooth wood tabletop', 'soft textured card'];
const times = ['soft morning daylight', 'quiet noon daylight', 'gentle late-afternoon light'];

const exactNicknameRules = [
  {
    match: /^花生$/,
    englishLabel: 'Peanut',
    interpretation: 'Direct literal reading: an unshelled peanut.',
    subjectPrompt:
      'Photograph one unshelled peanut and one exposed kernel resting close together on warm ivory paper. Close view showing delicate shell ridges. Soft light from the upper left with a short gentle shadow. Keep the peanut large and centrally placed; no bowl or extra props.',
  },
  {
    match: /^coffee$/i,
    englishLabel: 'Coffee',
    interpretation: 'Direct literal reading: a cup of coffee.',
    subjectPrompt:
      'Photograph a small unbranded cream ceramic cup filled with dark coffee on a matte beige tabletop, viewed at a gentle angle from above. The coffee surface and cup rim must be clearly visible. Diffused window light from the left with subtle shadow. No hands, saucer, beans, or decorative props.',
  },
  {
    match: /^flying-fish$/i,
    englishLabel: 'Flying fish',
    interpretation: 'Literal visual interpretation of the English nickname.',
    subjectPrompt:
      'Create a photographic image of a single silver-blue flying fish gliding just above a calm muted blue sea, with wing-like pectoral fins extended. Side view with the whole fish centered. Pale softly blurred horizon, diffused morning light, restrained motion. Anatomically plausible fish fins, no bird wings, no dramatic splash, no extra fish.',
  },
  {
    match: /^回忆的天空$/,
    englishLabel: 'Sky of memories',
    interpretation: 'Poetic interpretation: a quiet sky with nostalgic photographic tone.',
    subjectPrompt:
      'Photograph a pale blue sky with one large soft white cloud centered above a very thin strip of distant rooftops along the bottom edge. Gentle late-afternoon light with slightly faded colors and fine grain. The sky should dominate the frame. No people, signage, or landmark emphasis.',
  },
  {
    match: /^大花$/,
    englishLabel: 'Big flower',
    interpretation: 'Literal reading of the nickname: one large bloom.',
    subjectPrompt:
      'Photograph one large dusty-pink dahlia bloom on a short visible green stem against a plain warm cream background. Face the flower toward the camera with all petals visible. Soft side daylight should reveal petal texture. One flower only, no vase, bouquet, or decorative pattern.',
  },
  {
    match: /^小朦胧$/,
    englishLabel: 'A little hazy',
    interpretation: 'Atmospheric interpretation of haze: soft mist and partial visibility.',
    subjectPrompt:
      'Photograph a single small leafy tree emerging from light morning mist beside still water. Center the tree and a faint reflection against a pale gray-green background. Diffused light with softened distant edges, but clear enough silhouette to read at thumbnail size. No people or buildings.',
  },
];

function readPeopleData() {
  const fileContent = fs.readFileSync(peoplePath, 'utf8');
  const markerIndex = fileContent.indexOf('PeopleData');
  const assignmentIndex = fileContent.indexOf('=', markerIndex);
  const arrayStart = fileContent.indexOf('[', assignmentIndex);

  let depth = 0;
  let inString = false;
  let quote = null;

  for (let i = arrayStart; i < fileContent.length; i += 1) {
    const char = fileContent[i];
    if (inString) {
      if (char === '\\') {
        i += 1;
        continue;
      }
      if (char === quote) {
        inString = false;
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      quote = char;
      continue;
    }

    if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        const jsonArrayText = fileContent.slice(arrayStart, i + 1);
        return JSON.parse(jsonArrayText);
      }
    }
  }

  throw new Error('Unable to parse PeopleData array.');
}

function stableIndex(seedText, length) {
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % length;
}

function inferAgeBand(person) {
  const year = Number(person.yearOfBirth);
  if (!Number.isFinite(year)) return 'middle-aged';
  const age = new Date().getFullYear() - year;
  if (age < 35) return 'young adult';
  if (age < 60) return 'middle-aged';
  return 'elderly';
}

function inferOccupationTag(person) {
  const text = `${person.occupation || ''} ${person.occupationCn || ''}`.toLowerCase();
  if (/(student|学生|同学|大学)/.test(text)) return 'student';
  if (/(teacher|教授|老师|教师)/.test(text)) return 'teacher';
  if (/(bank|finance|银行|财务|金融|会计)/.test(text)) return 'finance';
  if (/(engineer|机械|工程|制造|设计|it|通信)/.test(text)) return 'engineering';
  if (/(retired|退休|老人)/.test(text)) return 'retired';
  if (/(owner|个体|老板|经营|餐饮|店|自雇)/.test(text)) return 'owner';
  if (/(driver|物流|transport|快递|机场|司机)/.test(text)) return 'transport';
  if (/(law|律师|pharmac|药师|community|社区|government|国企|海关|工会|业委会)/.test(text)) return 'public_service';
  return 'resident';
}

function englishLabelFromNickname(nickname, id) {
  if (/^[a-z0-9\-\s]+$/i.test(nickname)) {
    return nickname.replace(/\s+/g, ' ').trim();
  }
  if (/同学/.test(nickname)) return 'Student alias';
  if (/老师/.test(nickname)) return 'Teacher alias';
  if (/先生/.test(nickname)) return 'Mr. alias';
  if (/女士|姐|阿姨/.test(nickname)) return 'Ms. alias';
  if (/爷爷|伯伯|叔/.test(nickname)) return 'Elder alias';
  return `Nickname motif ${id}`;
}

function buildGenericSubjectPrompt(person, nickname, occupationTag, ageBand) {
  const seed = `${person.id || ''}-${nickname}`;
  const color = colorWords[stableIndex(seed + '-color', colorWords.length)];
  const surface = surfaces[stableIndex(seed + '-surface', surfaces.length)];
  const daytime = times[stableIndex(seed + '-time', times.length)];
  const localBackground = person.shenzhenBorn
    ? 'a subtle local urban context suggesting lifelong Shenzhen familiarity'
    : 'a subtle local urban context suggesting a long-term migrant life in Shenzhen';

  const nicknameClean = String(nickname || 'Resident').trim();

  if (occupationTag === 'student') {
    return `Photograph one worn notebook, one transit card, and one small pen arranged in a clean triangle on ${color} ${surface}. Keep all objects centered and clearly separated, with ${daytime}. The scene should suggest focused study and daily commuting for a ${ageBand} resident. No readable text on items; keep branding removed.`;
  }

  if (occupationTag === 'teacher') {
    return `Photograph one closed lesson planner, one plain mug, and one pair of reading glasses on ${color} ${surface}. Center the planner as the focal object, with glasses slightly offset and soft shadow from ${daytime}. Calm academic mood, minimal props, no readable text.`;
  }

  if (occupationTag === 'finance') {
    return `Photograph one simple calculator, one neutral notebook, and one stainless pen placed with careful alignment on ${color} ${surface}. Straightforward top-down composition, balanced spacing, and ${daytime}. Professional but restrained mood. No digits, labels, or logos visible.`;
  }

  if (occupationTag === 'engineering') {
    return `Photograph one rolled blueprint-like blank paper, one metal ruler, and one pencil arranged on ${color} ${surface}. Keep the ruler as a crisp line through the center, lit by ${daytime}. The scene should suggest practical technical work and methodical thinking. No printed marks or logos.`;
  }

  if (occupationTag === 'retired') {
    return `Photograph one well-used thermos cup and one folded cloth fan resting on ${color} ${surface}. Leave generous negative space around the objects and use ${daytime} for a gentle, dignified atmosphere. Quiet, lived-in mood without nostalgic cliches or text.`;
  }

  if (occupationTag === 'owner') {
    return `Photograph one plain key ring with two keys and one small handwritten-order-pad-sized blank booklet on ${color} ${surface}. Center the keys with the booklet slightly behind, lit by ${daytime}. The scene should convey self-run daily business rhythm. Keep all surfaces clean and unbranded.`;
  }

  if (occupationTag === 'transport') {
    return `Photograph one unbranded transit pass holder and one compact foldable umbrella on ${color} ${surface}. Keep the pass holder centered with umbrella diagonally placed, lit by ${daytime}. Subtle motion-readiness mood, simple and practical, no logos or text.`;
  }

  if (occupationTag === 'public_service') {
    return `Photograph one plain folder, one neutral stamp pad case, and one pen arranged neatly on ${color} ${surface}. Keep the folder central and the other items parallel, under ${daytime}. The scene should suggest steady civic or community responsibility. No official emblems or readable text.`;
  }

  if (/花|梅|榕/.test(nicknameClean)) {
    return `Photograph one single fresh flower stem centered on ${color} ${surface}, with petals fully visible and a short natural shadow from ${daytime}. Keep composition simple and calm, with no vase and no secondary props.`;
  }

  if (/云|天空|晴/.test(nicknameClean)) {
    return `Photograph a quiet pale sky with one soft cloud formation centered above a narrow distant roofline. Use ${daytime} and restrained color for a reflective mood. Keep the horizon low and maintain clear central readability for circular crop.`;
  }

  return `Photograph one personal everyday object composition inspired by the nickname "${nicknameClean}": a plain notebook, a small key ring, and a transit card holder arranged on ${color} ${surface}. Keep the notebook central with measured spacing and ${daytime}. Maintain a quiet observational mood with ${localBackground}. No text or logos.`;
}

function resolveExactRule(nickname) {
  const key = String(nickname || '').trim();
  return exactNicknameRules.find((rule) => rule.match.test(key)) || null;
}

function buildEntry(person) {
  const id = String(person.id || 'unknown');
  const nickname = String(person.nickname || person.name || id);
  const exactRule = resolveExactRule(nickname);

  if (exactRule) {
    return {
      id,
      nickname,
      englishLabel: exactRule.englishLabel,
      interpretation: exactRule.interpretation,
      subjectPrompt: exactRule.subjectPrompt,
      imagePrompt: `${exactRule.subjectPrompt}\n\n${SHARED_STYLE}`,
      imageFile: `${id}-v2.png`,
    };
  }

  const occupationTag = inferOccupationTag(person);
  const ageBand = inferAgeBand(person);
  const subjectPrompt = buildGenericSubjectPrompt(person, nickname, occupationTag, ageBand);
  const interpretation = `Structured symbolic interpretation of nickname "${nickname}" guided by occupation (${occupationTag}) and life stage (${ageBand}).`;

  return {
    id,
    nickname,
    englishLabel: englishLabelFromNickname(nickname, id),
    interpretation,
    subjectPrompt,
    imagePrompt: `${subjectPrompt}\n\n${SHARED_STYLE}`,
    imageFile: `${id}-v2.png`,
  };
}

function main() {
  const people = readPeopleData();
  const trials = people.map(buildEntry);

  const result = {
    status: 'draft_for_review',
    version: 'v2',
    count: trials.length,
    sharedStyle: SHARED_STYLE,
    trials,
    notes: 'Auto-generated precise nickname prompts for all people. Review culturally sensitive nickname interpretations before batch image generation.',
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

  console.log(`Generated ${trials.length} nickname prompts.`);
  console.log(`Output written to ${path.relative(projectRoot, outputPath)}.`);
}

main();