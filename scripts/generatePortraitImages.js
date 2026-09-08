import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const promptsPath = path.join(projectRoot, 'portrait_prompts.json');
const outputDir = path.join(projectRoot, 'public', 'portraits');

function parseArgs(argv) {
  let limit = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--limit') {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        limit = Number(next);
        i += 1;
      }
    } else if (arg.startsWith('--limit=')) {
      limit = Number(arg.split('=')[1]);
    }
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    return null;
  }

  return limit;
}

const limit = parseArgs(process.argv.slice(2));

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error('Missing GEMINI_API_KEY. Set it in .env.local or your shell before running this script.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

function ensureOutputDir() {
  fs.mkdirSync(outputDir, { recursive: true });
}

function readPrompts() {
  const raw = fs.readFileSync(promptsPath, 'utf8');
  const prompts = JSON.parse(raw);
  if (!Array.isArray(prompts)) {
    throw new Error('portrait_prompts.json does not contain an array of prompts.');
  }
  return prompts;
}

async function generateImageForPrompt(promptEntry) {
  const promptText = promptEntry.imagePrompt || promptEntry.prompt || '';
  if (!promptText.trim()) {
    throw new Error(`No prompt text for ${promptEntry.id || 'unknown'}.`);
  }

  const response = await ai.models.generateImages({
    model: 'imagen-3.0-generate-002',
    prompt: promptText,
    config: {
      numberOfImages: 1,
      aspectRatio: '1:1',
      includeRaiReason: true,
      outputMimeType: 'image/png',
    },
  });

  const imageData = response?.generatedImages?.[0]?.image?.imageBytes;
  if (!imageData) {
    throw new Error(`No image returned for ${promptEntry.id}.`);
  }

  const fileName = `${String(promptEntry.id || 'portrait').replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
  const imagePath = path.join(outputDir, fileName);

  const buffer = Buffer.from(imageData, 'base64');
  fs.writeFileSync(imagePath, buffer);

  return fileName;
}

async function main() {
  ensureOutputDir();
  const prompts = readPrompts();
  const selectedPrompts = limit === null ? prompts : prompts.slice(0, Math.min(limit, prompts.length));

  console.log(
    limit === null
      ? `Generating all ${selectedPrompts.length} portraits.`
      : `Generating first ${selectedPrompts.length} portraits (trial run).`
  );

  const results = [];
  for (const promptEntry of selectedPrompts) {
    try {
      const fileName = await generateImageForPrompt(promptEntry);
      results.push({
        id: promptEntry.id,
        nickname: promptEntry.nickname,
        fileName,
        imagePath: `/portraits/${fileName}`,
      });
      console.log(`Generated ${promptEntry.id}: ${fileName}`);
    } catch (error) {
      console.error(`Failed for ${promptEntry.id}:`, error.message || error);
      results.push({
        id: promptEntry.id,
        nickname: promptEntry.nickname,
        error: error.message || String(error),
      });
    }
  }

  const summaryPath = path.join(projectRoot, 'generated_portraits.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Finished generating portraits. Summary written to ${path.relative(projectRoot, summaryPath)}.`);
}

main().catch((error) => {
  console.error('Portrait generation failed:', error);
  process.exit(1);
});
