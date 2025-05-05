#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { takeScreenshot } from "./services/screenshot.js";
import { uploadToS3 } from "./services/uploader.js";

// Load environment variables from specific path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Debug AWS configuration
console.log('AWS Configuration:');
console.log('Region:', process.env.AWS_REGION);
console.log('Bucket Name:', process.env.S3_BUCKET_NAME);
console.log('Access Key ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('Secret Key exists:', !!process.env.AWS_SECRET_ACCESS_KEY);

interface Args {
  url: string;
  out: string;
}

const argv = yargs(hideBin(process.argv))
  .option("url", { type: "string", demandOption: true, describe: "Homepage URL" })
  .option("out", { type: "string", default: "screenshot.png", describe: "Temp file path" })
  .parseSync() as Args;

(async () => {
  const outPath = path.resolve(process.cwd(), argv.out);

  console.log(`📸  Capturing ${argv.url} …`);
  await takeScreenshot(argv.url, outPath);

  console.log("⬆️  Uploading to S3 …");
  const link = await uploadToS3(outPath);

  console.log("✅  Done! Sharable link:");
  console.log(link);
})();
