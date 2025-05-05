import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
  urlColumn: string;
  screenshotUrlColumn: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export class GoogleSheetsService {
  private sheets;
  private config: SheetConfig;

  constructor(config: SheetConfig) {
    this.config = config;
    const auth = new JWT({
      email: config.credentials.client_email,
      key: config.credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async getUrls(): Promise<string[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!${this.config.urlColumn}:${this.config.urlColumn}`,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return [];
      }

      // Remove header row and filter out empty values
      return rows.slice(1).map(row => row[0]).filter(url => url && url.trim() !== '');
    } catch (error) {
      console.error('Error fetching URLs from Google Sheets:', error);
      throw error;
    }
  }

  async updateScreenshotUrl(rowIndex: number, screenshotUrl: string): Promise<void> {
    try {
      const range = `${this.config.sheetName}!${this.config.screenshotUrlColumn}${rowIndex + 2}`; // +2 because of 0-based index and header row
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.config.spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[screenshotUrl]],
        },
      });
    } catch (error) {
      console.error('Error updating screenshot URL in Google Sheets:', error);
      throw error;
    }
  }
} 