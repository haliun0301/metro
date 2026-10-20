import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const promptsPath = path.join(projectRoot, 'design', 'nickname-image-trials', 'trial-prompts-v2.json');
const outputDir = path.join(projectRoot, 'public', 'images', 'nickname-trials');
const resultsPath = path.join(projectRoot, 'design', 'nickname-image-trials', 'trial-results-v2.json');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function loadProjectEnv() {
  loadEnvFile(path.join(projectRoot, '.env'));
  loadEnvFile(path.join(projectRoot, '.env.local'));
}

function parseArgs(argv) {
  const options = {
    provider: 'openai',
    limit: null,
    start: 0,
    retries: 3,
    retryDelayMs: 1200,
    overwrite: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--limit' && argv[i + 1] && !argv[i + 1].startsWith('--')) {
      options.limit = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--provider' && argv[i + 1] && !argv[i + 1].startsWith('--')) {
      options.provider = String(argv[i + 1]).toLowerCase();
      i += 1;
    } else if (arg.startsWith('--provider=')) {
      options.provider = String(arg.split('=')[1]).toLowerCase();
    } else if (arg.startsWith('--limit=')) {
      options.limit = Number(arg.split('=')[1]);
    } else if (arg === '--start' && argv[i + 1] && !argv[i + 1].startsWith('--')) {
      options.start = Number(argv[i + 1]);
      i += 1;
    } else if (arg.startsWith('--start=')) {
      options.start = Number(arg.split('=')[1]);
    } else if (arg === '--retries' && argv[i + 1] && !argv[i + 1].startsWith('--')) {
      options.retries = Number(argv[i + 1]);
      i += 1;
    } else if (arg.startsWith('--retries=')) {
      options.retries = Number(arg.split('=')[1]);
    } else if (arg === '--retry-delay-ms' && argv[i + 1] && !argv[i + 1].startsWith('--')) {
      options.retryDelayMs = Number(argv[i + 1]);
      i += 1;
    } else if (arg.startsWith('--retry-delay-ms=')) {
      options.retryDelayMs = Number(arg.split('=')[1]);
    } else if (arg === '--overwrite') {
      options.overwrite = true;
    }
  }

  if (!Number.isInteger(options.limit) || options.limit <= 0) options.limit = null;
  if (!['openai', 'gemini'].includes(options.provider)) options.provider = 'openai';
  if (!Number.isInteger(options.start) || options.start < 0) options.start = 0;
  if (!Number.isInteger(options.retries) || options.retries < 0) options.retries = 3;
  if (!Number.isInteger(options.retryDelayMs) || options.retryDelayMs < 0) options.retryDelayMs = 1200;

  return options;
}

function readPromptPayload() {
  const raw = fs.readFileSync(promptsPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.trials)) {
    throw new Error('trial-prompts-v2.json must contain a trials array.');
  }
  return parsed;
}

function ensureDirs() {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.dirname(resultsPath), { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function getTargetFileName(trial) {
  const base = String(trial.imageFile || `${trial.id || 'unknown'}-v2.png`);
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function generateImage(ai, trial, options) {
  const promptText = String(trial.imagePrompt || '').trim();
  if (!promptText) {
    throw new Error(`No imagePrompt for ${trial.id || 'unknown'}.`);
  }

  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      let imageData;
      if (options.provider === 'openai') {
        const response = await ai.images.generate({
          model: 'gpt-image-1',
          prompt: promptText,
          size: '1024x1024',
        });
        imageData = response?.data?.[0]?.b64_json;
      } else {
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
        imageData = response?.generatedImages?.[0]?.image?.imageBytes;
      }

      if (!imageData) {
        throw new Error(`No image returned for ${trial.id || 'unknown'}.`);
      }

      const fileName = getTargetFileName(trial);
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(imageData, 'base64'));
      return fileName;
    } catch (error) {
      const shouldRetry = attempt < options.retries && isRetriableError(error);
      if (!shouldRetry) throw error;

      const delay = options.retryDelayMs * Math.pow(2, attempt);
      console.warn(`Retrying ${trial.id} in ${delay}ms (${attempt + 1}/${options.retries})`);
      await sleep(delay);
    }
  }

  throw new Error(`Exhausted retries for ${trial.id || 'unknown'}.`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  loadProjectEnv();

  let ai;
  if (options.provider === 'openai') {
    const apiKey =
      process.env.OPENAI_API_KEY ||
      process.env.API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing OPENAI-compatible API key. Set OPENAI_API_KEY (or API_KEY / GEMINI_API_KEY) in .env.local or your shell.');
      process.exit(1);
    }
    ai = new OpenAI({ apiKey });
  } else {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY. Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY) in .env.local or your shell.');
      process.exit(1);
    }
    ai = new GoogleGenAI({ apiKey });
  }

  const payload = readPromptPayload();
  ensureDirs();

  const from = Math.min(options.start, payload.trials.length);
  const source = payload.trials.slice(from);
  const selected = options.limit === null ? source : source.slice(0, Math.min(options.limit, source.length));

  console.log(`Generating ${selected.length} images from index ${from} using ${options.provider}.`);
  if (options.overwrite) {
    console.log('Overwrite mode enabled. Existing files will be replaced.');
  }

  const results = [];

  for (const trial of selected) {
    const targetName = getTargetFileName(trial);
    const outputPath = path.join(outputDir, targetName);

    if (!options.overwrite && fs.existsSync(outputPath)) {
      console.log(`Skipped ${trial.id}: already exists (${targetName})`);
      results.push({
        ...trial,
        imageFile: targetName,
        imagePath: `/images/nickname-trials/${targetName}`,
        skipped: true,
      });
      continue;
    }

    try {
      const fileName = await generateImage(ai, trial, options);
      console.log(`Generated ${trial.id}: ${fileName}`);
      results.push({
        ...trial,
        imageFile: fileName,
        imagePath: `/images/nickname-trials/${fileName}`,
      });
    } catch (error) {
      console.error(`Failed for ${trial.id}:`, error?.message || String(error));
      results.push({
        ...trial,
        error: error?.message || String(error),
      });
    }
  }

  const summary = {
    status: 'generated_trial_v2',
    generatedAt: new Date().toISOString(),
    source: path.relative(projectRoot, promptsPath),
    outputDir: path.relative(projectRoot, outputDir),
    provider: options.provider,
    sharedStyle: payload.sharedStyle,
    count: results.length,
    success: results.filter((item) => !item.error).length,
    failed: results.filter((item) => item.error).length,
    skipped: results.filter((item) => item.skipped).length,
    trials: results,
  };

  fs.writeFileSync(resultsPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`Summary written to ${path.relative(projectRoot, resultsPath)}.`);
  console.log(`Result: ${summary.success} success, ${summary.skipped} skipped, ${summary.failed} failed.`);
}

main().catch((error) => {
  console.error('Generation failed:', error);
  process.exit(1);
});
