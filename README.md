# Website Screenshot Tool

A Node.js tool that captures screenshots of websites and uploads them to AWS S3. This tool is specifically designed to capture hero sections of websites with precision and reliability, and can process multiple URLs from a Google Sheet.

## Features

- Captures hero sections of websites with exact dimensions
- Handles dynamic content loading with built-in delays
- Supports full viewport width capture for clean edges
- Automatic scroll position calculation for accurate section capture
- Uploads screenshots to AWS S3 with proper content type
- Returns public URLs for immediate access to screenshots
- Processes multiple URLs from a Google Sheet
- Automatically updates Google Sheet with screenshot URLs
- Configurable through environment variables
- TypeScript support for better development experience

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with S3 access
- S3 bucket with appropriate permissions
- Google Cloud Project with Sheets API enabled
- Google Service Account with Sheets API access

## Setup

1. Clone the repository:
```bash
git clone https://github.com/bsiles/hero_screenshot_aws.git
cd hero_screenshot_aws
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# AWS Configuration
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Google Sheets Configuration
GOOGLE_SHEET_ID=your-sheet-id
SHEET_NAME=Sheet1
URL_COLUMN=A
SCREENSHOT_URL_COLUMN=B
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key
```

4. Set up Google Sheets:
   - Create a new Google Sheet
   - Add a header row with "URL" in column A and "Screenshot URL" in column B
   - Add your website URLs in column A
   - Share the sheet with your service account email

5. Run the tool:
```bash
npm run dev
```

## Environment Variables

### AWS Configuration
- `AWS_REGION`: Your AWS region (e.g., us-east-2)
- `AWS_BUCKET_NAME`: Your S3 bucket name
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key

### Google Sheets Configuration
- `GOOGLE_SHEET_ID`: The ID of your Google Sheet (from the URL)
- `SHEET_NAME`: The name of the sheet tab (default: Sheet1)
- `URL_COLUMN`: The column containing URLs (default: A)
- `SCREENSHOT_URL_COLUMN`: The column for screenshot URLs (default: B)
- `GOOGLE_CLIENT_EMAIL`: Your Google service account email
- `GOOGLE_PRIVATE_KEY`: Your Google service account private key

## Usage

The tool will:
1. Read URLs from the specified Google Sheet column
2. For each URL:
   - Navigate to the website
   - Wait for dynamic content to load
   - Locate and capture the hero section
   - Upload the screenshot to S3
   - Update the Google Sheet with the screenshot URL
3. Continue until all URLs are processed

### Example Output
```
Found 5 URLs to process
Processing URL 1/5: https://example1.com
Successfully processed https://example1.com
Screenshot URL: https://your-bucket.s3.your-region.amazonaws.com/screenshots/screenshot-1234567890.png
...
All URLs processed successfully!
```

## Technical Details

- Uses Playwright for reliable web page capture
- Implements smart waiting for dynamic content
- Calculates exact dimensions based on hero section
- Handles viewport and scroll position automatically
- Supports modern web technologies and responsive designs
- Integrates with Google Sheets API for batch processing
- Uses AWS SDK for S3 integration

## Security

- Never commit your `.env` file to version control
- Keep your AWS credentials secure
- Use IAM roles with minimal required permissions
- Consider using AWS Secrets Manager for production deployments
- Secure your Google service account credentials
- Use appropriate Google Sheets sharing settings

## Development

The project is built with:
- TypeScript for type safety
- Playwright for web automation
- AWS SDK for S3 integration
- Google Sheets API for spreadsheet integration
- Dotenv for environment management

## Contributing

Feel free to submit issues and enhancement requests! 