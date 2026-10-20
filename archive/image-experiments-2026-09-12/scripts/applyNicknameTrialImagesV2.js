import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const peoplePath = path.join(projectRoot, 'data', 'metro-people', 'people.ts');
const designImageDir = path.join(projectRoot, 'design', 'nickname-image-trials');
const imageDir = path.join(projectRoot, 'public', 'images', 'nickname-trials');

function parsePeopleArray(fileContent) {
  const markerIndex = fileContent.indexOf('PeopleData');
  const assignmentIndex = fileContent.indexOf('=', markerIndex);
  const arrayStart = fileContent.indexOf('[', assignmentIndex);
  if (arrayStart === -1) throw new Error('Could not find PeopleData array start.');

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
        return {
          arrayStart,
          arrayEnd: i,
          data: JSON.parse(fileContent.slice(arrayStart, i + 1)),
        };
      }
    }
  }

  throw new Error('Could not find end of PeopleData array.');
}

function sanitizeFileName(value) {
  return String(value || '').replace(/[^a-zA-Z0-9._-]/g, '_');
}

function isImageFile(fileName) {
  return /\.(png|jpe?g|webp|gif|avif)$/i.test(fileName);
}

function parseVersion(fileName) {
  const match = fileName.match(/-v(\d+)\.[^.]+$/i);
  if (!match) return 0;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : 0;
}

function parsePersonId(fileName) {
  const match = fileName.match(/^(person\d{3})/i);
  return match ? match[1].toLowerCase() : null;
}

function getNickNameImageChoices() {
  if (!fs.existsSync(designImageDir)) {
    return new Map();
  }

  const files = fs.readdirSync(designImageDir)
    .filter((name) => isImageFile(name));

  const bestByPerson = new Map();
  for (const fileName of files) {
    const personId = parsePersonId(fileName);
    if (!personId) continue;

    const candidate = {
      fileName,
      version: parseVersion(fileName),
      sourcePath: path.join(designImageDir, fileName),
    };

    const previous = bestByPerson.get(personId);
    if (!previous) {
      bestByPerson.set(personId, candidate);
      continue;
    }

    if (candidate.version > previous.version || (candidate.version === previous.version && candidate.fileName > previous.fileName)) {
      bestByPerson.set(personId, candidate);
    }
  }

  return bestByPerson;
}

function syncDesignImagesToPublic(bestByPerson) {
  fs.mkdirSync(imageDir, { recursive: true });

  let copied = 0;
  let unchanged = 0;

  for (const [, entry] of bestByPerson) {
    const targetName = sanitizeFileName(entry.fileName);
    const targetPath = path.join(imageDir, targetName);

    const sourceBuffer = fs.readFileSync(entry.sourcePath);
    if (fs.existsSync(targetPath)) {
      const targetBuffer = fs.readFileSync(targetPath);
      if (Buffer.compare(sourceBuffer, targetBuffer) === 0) {
        unchanged += 1;
        continue;
      }
    }

    fs.writeFileSync(targetPath, sourceBuffer);
    copied += 1;
  }

  return { copied, unchanged };
}

function main() {
  const bestByPerson = getNickNameImageChoices();
  const copyStats = syncDesignImagesToPublic(bestByPerson);

  if (bestByPerson.size === 0) {
    console.log('No nickname trial images found in design folder.');
    return;
  }

  const source = fs.readFileSync(peoplePath, 'utf8');
  const parsed = parsePeopleArray(source);

  let updated = 0;
  const nextPeople = parsed.data.map((person) => {
    const id = String(person.id || '').toLowerCase();
    const image = bestByPerson.get(id);
    if (!image) {
      return person;
    }

    const fileName = sanitizeFileName(image.fileName);
    const imageSrc = `/images/nickname-trials/${fileName}`;
    const currentSrc = String(person?.profileImage?.src || '');
    if (currentSrc === imageSrc) {
      return person;
    }

    updated += 1;
    return {
      ...person,
      profileImage: {
        ...(person.profileImage || {}),
        src: imageSrc,
        alt: `${String(person.nickname || person.name || person.id || 'Resident')} nickname visual`,
      },
    };
  });

  if (updated === 0) {
    console.log(`Found ${bestByPerson.size} matched nickname trial images in design folder.`);
    console.log(`Copied ${copyStats.copied} files to public and skipped ${copyStats.unchanged} unchanged files.`);
    console.log('Updated 0 people with new image paths.');
    console.log('No data file changes were written.');
    return;
  }

  const nextArrayText = JSON.stringify(nextPeople, null, 2);
  const nextContent = `${source.slice(0, parsed.arrayStart)}${nextArrayText}${source.slice(parsed.arrayEnd + 1)}`;
  fs.writeFileSync(peoplePath, nextContent, 'utf8');

  console.log(`Found ${bestByPerson.size} matched nickname trial images in design folder.`);
  console.log(`Copied ${copyStats.copied} files to public and skipped ${copyStats.unchanged} unchanged files.`);
  console.log(`Updated ${updated} people with nickname trial images.`);
}

main();
