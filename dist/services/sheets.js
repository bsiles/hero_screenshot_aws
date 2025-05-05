import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
export class GoogleSheetsService {
    sheets;
    config;
    constructor(config) {
        this.config = config;
        const auth = new JWT({
            email: config.credentials.client_email,
            key: config.credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.sheets = google.sheets({ version: 'v4', auth });
    }
    async getUrls() {
        try {
            // First, get the sheet metadata to verify the sheet exists
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.config.spreadsheetId,
                range: `Sheet1!${this.config.urlColumn}:${this.config.urlColumn}`, // Use Sheet1 instead of the spreadsheet title
            });
            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                return [];
            }
            // Skip the header row but keep the original row indices
            return rows.slice(1).map((row, index) => ({
                url: row[0] || '',
                rowIndex: index + 1 // Add 1 to account for the header row
            }));
        }
        catch (error) {
            // If there's an error, try to get more information about the spreadsheet
            try {
                const metadata = await this.sheets.spreadsheets.get({
                    spreadsheetId: this.config.spreadsheetId,
                });
                console.log('Spreadsheet metadata:', JSON.stringify(metadata.data, null, 2));
            }
            catch (metadataError) {
                console.error('Error getting spreadsheet metadata:', metadataError);
            }
            console.error('Error fetching URLs from Google Sheets:', error);
            throw error;
        }
    }
    async updateScreenshotUrl(rowIndex, screenshotUrl) {
        try {
            const range = `Sheet1!${this.config.screenshotUrlColumn}${rowIndex + 1}`; // +1 because of 0-based index
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.config.spreadsheetId,
                range,
                valueInputOption: 'RAW',
                requestBody: {
                    values: [[screenshotUrl]],
                },
            });
        }
        catch (error) {
            console.error('Error updating screenshot URL in Google Sheets:', error);
            throw error;
        }
    }
}
