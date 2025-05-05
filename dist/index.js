#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import path from "path";
import dotenv from "dotenv";
import { takeScreenshot } from "./services/screenshot.js";
import { uploadToS3 } from "./services/uploader.js";
// Load environment variables from specific path
dotenv.config({ path: '/Users/brynnsiles/screenshot_embed/website-screenshot-agent/.env' });
// Debug AWS configuration
console.log('AWS Configuration:');
console.log('Region:', process.env.AWS_REGION || 'us-east-1');
console.log('Bucket Name:', process.env.S3_BUCKET_NAME);
console.log('Access Key ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('Secret Key exists:', !!process.env.AWS_SECRET_ACCESS_KEY);
const argv = yargs(hideBin(process.argv))
    .option("url", { type: "string", demandOption: true, describe: "Homepage URL" })
    .option("out", { type: "string", default: "screenshot.png", describe: "Temp file path" })
    .parseSync();
(async () => {
    const outPath = path.resolve(process.cwd(), argv.out);
    console.log(`📸  Capturing ${argv.url} …`);
    await takeScreenshot(argv.url, outPath);
    console.log("⬆️  Uploading to S3 …");
    const link = await uploadToS3(outPath);
    console.log("✅  Done! Sharable link:");
    console.log(link);
})();
