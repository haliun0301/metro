import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const promptsPath = path.join(projectRoot, 'portrait_prompts.json');
const outputDir = path.join(projectRoot, 'public', 'portraits');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex <= 0) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadProjectEnv() {
  loadEnvFile(path.join(projectRoot, '.env'));
  loadEnvFile(path.join(projectRoot, '.env.local'));
}

function parseArgs(argv) {
  const options = {
    limit: null,
    retries: 3,
    retryDelayMs: 1200,
    overwrite: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--limit') {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        options.limit = Number(next);
        i += 1;
      }
    } else if (arg.startsWith('--limit=')) {
      options.limit = Number(arg.split('=')[1]);
    } else if (arg === '--retries') {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        options.retries = Number(next);
        i += 1;
      }
    } else if (arg.startsWith('--retries=')) {
      options.retries = Number(arg.split('=')[1]);
    } else if (arg === '--retry-delay-ms') {
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        options.retryDelayMs = Number(next);
        i += 1;
      }
    } else if (arg.startsWith('--retry-delay-ms=')) {
      options.retryDelayMs = Number(arg.split('=')[1]);
    } else if (arg === '--overwrite') {
      options.overwrite = true;
    }
  }

  if (!Number.isInteger(options.limit) || options.limit <= 0) {
    options.limit = null;
  }

  if (!Number.isInteger(options.retries) || options.retries < 0) {
    options.retries = 3;
  }

  if (!Number.isInteger(options.retryDelayMs) || options.retryDelayMs < 0) {
    options.retryDelayMs = 1200;
  }

  return options;
}

const options = parseArgs(process.argv.slice(2));

loadProjectEnv();

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error('Missing GEMINI_API_KEY. Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY) in .env.local or your shell before running this script.');
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getOutputFileName(promptEntry) {
  return `${String(promptEntry.id || 'portrait').replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
}

function isRetriableError(error) {
  const message = String(error?.message || error || '').toLowerCase();
  return [
    'fetch failed',
    'timed out',
    'econnreset',
    'etimedout',
    '429',
    '503',
    'service unavailable',
    'rate limit',
  ].some((token) => message.includes(token));
}

async function generateImageForPrompt(promptEntry, retries, retryDelayMs) {
  const promptText = promptEntry.imagePrompt || promptEntry.prompt || '';
  if (!promptText.trim()) {
    throw new Error(`No prompt text for ${promptEntry.id || 'unknown'}.`);
  }

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
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

      const fileName = getOutputFileName(promptEntry);
      const imagePath = path.join(outputDir, fileName);
      const buffer = Buffer.from(imageData, 'base64');
      fs.writeFileSync(imagePath, buffer);
      return fileName;
    } catch (error) {
      const shouldRetry = attempt < retries && isRetriableError(error);
      if (!shouldRetry) {
        throw error;
      }

      const delay = retryDelayMs * Math.pow(2, attempt);
      console.warn(`Retrying ${promptEntry.id} in ${delay}ms (${attempt + 1}/${retries})`);
      await sleep(delay);
    }
  }

  throw new Error(`Exhausted retries for ${promptEntry.id}.`);
}

async function main() {
  ensureOutputDir();
  const prompts = readPrompts();
  const selectedPrompts =
    options.limit === null
      ? prompts
      : prompts.slice(0, Math.min(options.limit, prompts.length));

  console.log(
    options.limit === null
      ? `Generating all ${selectedPrompts.length} portraits.`
      : `Generating first ${selectedPrompts.length} portraits (trial run).`
  );
  if (options.overwrite) {
    console.log('Overwrite mode enabled. Existing files will be replaced.');
  }

  const results = [];
  for (const promptEntry of selectedPrompts) {
    try {
      const fileName = getOutputFileName(promptEntry);
      const outputPath = path.join(outputDir, fileName);

      if (!options.overwrite && fs.existsSync(outputPath)) {
        results.push({
          id: promptEntry.id,
          nickname: promptEntry.nickname,
          fileName,
          imagePath: `/portraits/${fileName}`,
          skipped: true,
        });
        console.log(`Skipped ${promptEntry.id}: already exists (${fileName})`);
        continue;
      }

      const generatedFileName = await generateImageForPrompt(promptEntry, options.retries, options.retryDelayMs);
      results.push({
        id: promptEntry.id,
        nickname: promptEntry.nickname,
        fileName: generatedFileName,
        imagePath: `/portraits/${generatedFileName}`,
      });
      console.log(`Generated ${promptEntry.id}: ${generatedFileName}`);
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

  const generated = results.filter((item) => !item.error && !item.skipped).length;
  const skipped = results.filter((item) => item.skipped).length;
  const failed = results.filter((item) => item.error).length;

  console.log(`Finished generating portraits. Summary written to ${path.relative(projectRoot, summaryPath)}.`);
  console.log(`Result: ${generated} generated, ${skipped} skipped, ${failed} failed.`);
}

main().catch((error) => {
  console.error('Portrait generation failed:', error);
  process.exit(1);
});
