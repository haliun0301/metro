import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SOURCE_CANDIDATES = [
  'src/data/people.ts',
  'src/data/people.js',
  'data/metro-people/people.ts',
  'data/metro-people/people.js',
  'data/people.ts',
  'data/people.js',
  'src/data/people.json',
];

const MASTER_STYLE = `A consistent portrait illustration for a Shenzhen community visualization.

Semi-realistic digital portrait.
Head and shoulders composition.
Natural facial expression.
Authentic everyday appearance.

Style:
- editorial documentary illustration
- warm human-centered design
- subtle texture
- realistic proportions
- contemporary cultural computing aesthetic

Composition:
- same portrait angle
- same crop
- same lighting
- same background
- consistent character design system

Background:
minimal Shenzhen urban atmosphere with soft metro-inspired gradient.

No text, no labels, no logos.`;

function getCandidateRoots() {
  const roots = new Set([projectRoot, path.resolve(projectRoot, '..')]);

  try {
    const desktopDir = path.dirname(projectRoot);
    if (fs.existsSync(desktopDir)) {
      for (const entry of fs.readdirSync(desktopDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        if (/^shenzhen-metro/i.test(entry.name)) {
          roots.add(path.join(desktopDir, entry.name));
        }
      }
    }
  } catch {
    // Ignore directory listing errors.
  }

  return [...roots];
}

function resolvePeopleSource() {
  const roots = getCandidateRoots();

  for (const root of roots) {
    for (const relative of SOURCE_CANDIDATES) {
      const candidate = path.join(root, relative);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  throw new Error(
    `Could not find a PeopleData source file. Checked roots: ${roots.join(', ')}; candidates: ${SOURCE_CANDIDATES.join(', ')}`
  );
}

function extractPeopleArray(fileContent) {
  const markerIndex = fileContent.indexOf('PeopleData');
  if (markerIndex === -1) {
    throw new Error('PeopleData export not found in the dataset file.');
  }

  const assignmentIndex = fileContent.indexOf('=', markerIndex);
  if (assignmentIndex === -1) {
    throw new Error('PeopleData assignment not found in the dataset file.');
  }

  const arrayStart = fileContent.indexOf('[', assignmentIndex);
  if (arrayStart === -1) {
    throw new Error('PeopleData array start not found in the dataset file.');
  }

  let bracketDepth = 0;
  let inString = false;
  let stringQuote = null;

  for (let i = arrayStart; i < fileContent.length; i += 1) {
    const char = fileContent[i];

    if (inString) {
      if (char === '\\') {
        i += 1;
        continue;
      }

      if (char === stringQuote) {
        inString = false;
        stringQuote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      stringQuote = char;
      continue;
    }

    if (char === '[') {
      bracketDepth += 1;
      continue;
    }

    if (char === ']') {
      bracketDepth -= 1;
      if (bracketDepth === 0) {
        const arrayText = fileContent.slice(arrayStart, i + 1);
        return JSON.parse(arrayText);
      }
    }
  }

  throw new Error('PeopleData array could not be safely extracted.');
}

function getAgeGroup(yearOfBirth) {
  const year = Number(yearOfBirth);
  if (!Number.isFinite(year)) {
    return 'middle-aged';
  }

  const age = new Date().getFullYear() - year;

  if (age < 35) return 'young adult';
  if (age < 60) return 'middle-aged';
  return 'elderly';
}

function inferVisualArchetype(person) {
  const occupation = String(person.occupation || person.occupationCn || '').toLowerCase();
  const nickname = String(person.nickname || person.name || '').toLowerCase();

  if (/(student|university|college|school)/.test(occupation) || /(学生|大学生|同学)/.test(nickname)) {
    return 'young_student';
  }

  if (/(teacher|professor|lecturer|schoolteacher)/.test(occupation) || /(老师|教师)/.test(occupation)) {
    return 'teacher';
  }

  if (/(engineer|technical|mechanical|architect|construction|manufacturing|design)/.test(occupation) || /(工程|机械|设计|技术)/.test(occupation)) {
    return 'engineer';
  }

  if (/(retired|retire|pension|elder)/.test(occupation) || /(退休|老年|老人)/.test(occupation)) {
    return 'retired_worker';
  }

  if (/(owner|business|shop|restaurant|catering|trader|entrepreneur|self-employed|merchant)/.test(occupation) || /(老板|经营|餐饮|个体)/.test(occupation)) {
    return 'local_business_owner';
  }

  if (/(designer|creative|artist|media|writer|editor)/.test(occupation) || /(设计|创作|媒体)/.test(occupation)) {
    return 'creative_professional';
  }

  if (/(bank|clerk|office|admin|manager|enterprise|company|telecom|communication|staff|employee|operation)/.test(occupation) || /(银行|职员|员工|企业|通信|文员|经理)/.test(occupation)) {
    return 'office_worker';
  }

  return 'local_resident';
}

function getAppearanceGuidance(person, ageGroup, visualArchetype) {
  const occupationMap = {
    young_student: 'youthful student appearance, casual contemporary clothing, bright and curious expression',
    teacher: 'calm academic appearance, neat professional clothes, approachable and thoughtful expression',
    engineer: 'practical technical professional appearance, functional clothing, focused and reliable expression',
    retired_worker: 'elderly community member appearance, comfortable everyday clothing, warm lived-in expression',
    local_business_owner: 'friendly local entrepreneur appearance, neatly dressed for neighborhood life, confident and approachable expression',
    creative_professional: 'creative professional appearance, modern urban fashion, observant and expressive face',
    office_worker: 'professional office worker appearance, polished everyday attire, composed and steady expression',
    local_resident: 'ordinary Shenzhen resident appearance, authentic everyday look, balanced and natural expression',
  };

  const ageTone = {
    'young adult': 'youthful and energetic',
    'middle-aged': 'mature and grounded',
    elderly: 'weathered but dignified',
  };

  const occupationNote = occupationMap[visualArchetype] || occupationMap.local_resident;
  const localContext = person.shenzhenBorn
    ? 'born and raised in Shenzhen with a strong local urban identity'
    : 'long-term Shenzhen resident with migration experience and local community ties';

  return `${ageTone[ageGroup] || 'everyday'} appearance; ${occupationNote}; ${localContext}; clothing suited to everyday Shenzhen city life and community routines.`;
}

function buildPrompt(person, ageGroup, visualArchetype) {
  const nickname = person.nickname || person.name || 'Resident';
  const occupation = person.occupation || person.occupationCn || 'Community resident';
  const appearanceGuidance = getAppearanceGuidance(person, ageGroup, visualArchetype);

  return `${MASTER_STYLE}

Portrait brief:
- Identity: ${nickname}
- Age group: ${ageGroup}
- Visual archetype: ${visualArchetype}
- Occupation: ${occupation}
- Background: ${person.shenzhenBorn ? 'Shenzhen-born local resident' : 'long-term Shenzhen resident'}

Appearance guidance:
${appearanceGuidance}

Create a portrait that matches the same consistent character design system as all other portraits in this dataset. Keep the same crop, lighting, expression style, and soft urban gradient background while preserving a distinct but authentic individuality for this person.`;
}

function main() {
  const sourcePath = resolvePeopleSource();
  const fileContent = fs.readFileSync(sourcePath, 'utf8');
  const peopleData = extractPeopleArray(fileContent);

  if (!Array.isArray(peopleData)) {
    throw new Error('PeopleData is not an array.');
  }

  const prompts = peopleData.map((person) => {
    const ageGroup = getAgeGroup(person.yearOfBirth);
    const visualArchetype = inferVisualArchetype(person);

    return {
      id: String(person.id || ''),
      nickname: String(person.nickname || person.name || ''),
      ageGroup,
      visualArchetype,
      imagePrompt: buildPrompt(person, ageGroup, visualArchetype),
    };
  });

  const outputPath = path.join(projectRoot, 'portrait_prompts.json');
  fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2), 'utf8');

  console.log(`Generated ${prompts.length} portrait prompts from ${path.relative(projectRoot, sourcePath)}.`);
  console.log(`Output written to ${path.relative(projectRoot, outputPath)}.`);
}

main();
