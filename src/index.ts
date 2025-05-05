#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { takeScreenshot } from "./services/screenshot.js";
import { uploadToS3 } from "./services/uploader.js";
import { config } from 'dotenv';
import { ScreenshotService } from './services/screenshot';
import { UploaderService } from './services/uploader';
import { GoogleSheetsService, SheetConfig } from './services/sheets';

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

async function main() {
  try {
    // Initialize services
    const screenshotService = new ScreenshotService();
    const uploaderService = new UploaderService();
    
    // Configure Google Sheets
    const sheetConfig: SheetConfig = {
      spreadsheetId: process.env.GOOGLE_SHEET_ID || '',
      sheetName: process.env.SHEET_NAME || 'Sheet1',
      urlColumn: process.env.URL_COLUMN || 'A',
      screenshotUrlColumn: process.env.SCREENSHOT_URL_COLUMN || 'B',
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL || '',
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      },
    };

    const sheetsService = new GoogleSheetsService(sheetConfig);

    // Get URLs from Google Sheet
    const urls = await sheetsService.getUrls();
    console.log(`Found ${urls.length} URLs to process`);

    // Process each URL
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`Processing URL ${i + 1}/${urls.length}: ${url}`);

      try {
        // Capture screenshot
        const screenshot = await screenshotService.capture(url);
        
        // Upload to S3
        const screenshotUrl = await uploaderService.upload(screenshot);
        
        // Update Google Sheet with screenshot URL
        await sheetsService.updateScreenshotUrl(i, screenshotUrl);
        
        console.log(`Successfully processed ${url}`);
        console.log(`Screenshot URL: ${screenshotUrl}`);
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        // Continue with next URL even if one fails
      }
    }

    console.log('All URLs processed successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
