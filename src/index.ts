#!/usr/bin/env node
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';
import { ScreenshotService } from './services/screenshot.js';
import { UploaderService } from './services/uploader.js';
import { GoogleSheetsService, SheetConfig } from './services/sheets.js';
import fs from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = '/Users/brynnsiles/screenshot_embed/website-screenshot-agent/.env';

console.log('Attempting to load .env from:', envPath);

// Read the .env file directly
try {
  const envContents = fs.readFileSync(envPath, 'utf8');
  console.log('\nDirect .env file contents:');
  console.log(envContents);
} catch (error) {
  console.error('Error reading .env file directly:', error);
}

const result = config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
} else {
  console.log('Successfully loaded .env file');
}

// Debug configuration with more details
console.log('\nRaw Environment Variables:');
console.log('GOOGLE_SHEET_ID:', JSON.stringify(process.env.GOOGLE_SHEET_ID));
console.log('SHEET_NAME:', JSON.stringify(process.env.SHEET_NAME));
console.log('URL_COLUMN:', JSON.stringify(process.env.URL_COLUMN));
console.log('SCREENSHOT_URL_COLUMN:', JSON.stringify(process.env.SCREENSHOT_URL_COLUMN));
console.log('GOOGLE_CLIENT_EMAIL:', JSON.stringify(process.env.GOOGLE_CLIENT_EMAIL));
console.log('GOOGLE_PRIVATE_KEY length:', process.env.GOOGLE_PRIVATE_KEY?.length);
console.log('GOOGLE_PRIVATE_KEY first 50 chars:', JSON.stringify(process.env.GOOGLE_PRIVATE_KEY?.substring(0, 50)));

console.log('\nEnvironment Configuration:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);
console.log('AWS_ACCESS_KEY_ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY exists:', !!process.env.AWS_SECRET_ACCESS_KEY);
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID);
console.log('SHEET_NAME:', process.env.SHEET_NAME);
console.log('URL_COLUMN:', process.env.URL_COLUMN);
console.log('SCREENSHOT_URL_COLUMN:', process.env.SCREENSHOT_URL_COLUMN);
console.log('GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL);
console.log('GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('GOOGLE_PRIVATE_KEY starts with:', process.env.GOOGLE_PRIVATE_KEY?.substring(0, 40));

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

    console.log('\nSheet Configuration:');
    console.log('spreadsheetId:', sheetConfig.spreadsheetId);
    console.log('sheetName:', sheetConfig.sheetName);
    console.log('urlColumn:', sheetConfig.urlColumn);
    console.log('screenshotUrlColumn:', sheetConfig.screenshotUrlColumn);
    console.log('client_email:', sheetConfig.credentials.client_email);
    console.log('private_key starts with:', sheetConfig.credentials.private_key.substring(0, 40));

    const sheetsService = new GoogleSheetsService(sheetConfig);

    // Get URLs from Google Sheet
    const urlEntries = await sheetsService.getUrls();
    console.log(`Found ${urlEntries.length} rows to process`);

    // Process each URL
    let processedCount = 0;
    for (let i = 0; i < urlEntries.length; i++) {
      const { url, rowIndex } = urlEntries[i];
      
      try {
        if (!url || url.trim() === '') {
          // Clear the screenshot URL for empty URLs
          await sheetsService.updateScreenshotUrl(rowIndex, '');
          console.log(`Cleared screenshot URL at row ${rowIndex + 2} (empty URL)`);
          continue;
        }

        console.log(`Processing URL ${i + 1}/${urlEntries.length}: ${url}`);

        // Capture screenshot
        const screenshot = await screenshotService.capture(url);
        
        // Upload to S3
        const screenshotUrl = await uploaderService.upload(screenshot);
        
        // Update Google Sheet with screenshot URL
        await sheetsService.updateScreenshotUrl(rowIndex, screenshotUrl);
        
        console.log(`Successfully processed ${url}`);
        console.log(`Screenshot URL: ${screenshotUrl}`);
        processedCount++;
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        // Clear the screenshot URL on error
        try {
          await sheetsService.updateScreenshotUrl(rowIndex, '');
          console.log(`Cleared screenshot URL at row ${rowIndex + 2} (error occurred)`);
        } catch (clearError) {
          console.error(`Error clearing screenshot URL at row ${rowIndex + 2}:`, clearError);
        }
      }
    }

    console.log(`Processed ${processedCount} URLs successfully!`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
