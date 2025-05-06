import { ScreenshotService } from './services/screenshot.js';
import { GoogleSheetsService, SheetConfig } from './services/sheets.js';
import { UploaderService } from './services/uploader.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Load environment variables
config({ path: envPath });

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
    const urlEntries = await sheetsService.getUrls();
    console.log(`Found ${urlEntries.length} rows to process`);

    // Process each URL
    for (let i = 0; i < urlEntries.length; i++) {
      const { url, rowIndex } = urlEntries[i];
      
      try {
        if (!url || url.trim() === '') {
          console.log(`Skipping empty URL at row ${rowIndex + 2}`);
          continue;
        }

        console.log(`Processing URL ${i + 1}/${urlEntries.length}: ${url}`);

        // Capture screenshot
        const screenshot = await screenshotService.capture(url);
        
        // Upload to S3
        const screenshotUrl = await uploaderService.upload(screenshot);
        console.log(`Uploaded to S3: ${screenshotUrl}`);
        
        // Update Google Sheet with screenshot URL
        await sheetsService.updateScreenshotUrl(rowIndex, screenshotUrl);
        console.log(`Updated Google Sheet at row ${rowIndex + 2}`);
        
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

    console.log('Processing completed!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 