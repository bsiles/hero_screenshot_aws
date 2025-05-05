# Website Screenshot Agent

A Node.js application that automatically captures screenshots of websites and manages them through Google Sheets integration.

## Features

- Captures full-page screenshots of websites using Playwright
- Integrates with Google Sheets for URL input and screenshot URL output
- Handles dynamic content and waits for page load
- Supports custom viewport sizes and screenshot dimensions
- Automatically uploads screenshots to AWS S3
- Clears screenshot URLs for failed captures or empty rows
- Preserves header row in Google Sheets
- Handles rate limiting and retries

## Prerequisites

- Node.js (v16 or higher)
- AWS Account with S3 bucket
- Google Cloud Project with Google Sheets API enabled
- Google Service Account with appropriate permissions

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd website-screenshot-agent
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
URL_COLUMN=your_url_column_letter
SCREENSHOT_URL_COLUMN=your_screenshot_url_column_letter
```

## Configuration

### Google Sheets Setup

1. Create a new Google Sheet
2. Add a header row with appropriate column names
3. Add website URLs in the specified URL column
4. Share the sheet with your service account email
5. Copy the Sheet ID from the URL

### AWS S3 Setup

1. Create an S3 bucket
2. Configure CORS if needed
3. Create an IAM user with S3 access
4. Generate access keys for the IAM user

## Usage

1. Build the project:
```bash
npm run build
```

2. Run the agent:
```bash
npm run start
```

The agent will:
1. Read URLs from the specified column in Google Sheets
2. Capture screenshots of each website
3. Upload screenshots to S3
4. Update the screenshot URLs in Google Sheets
5. Clear screenshot URLs for failed captures or empty rows

## Error Handling

- Failed captures will clear the screenshot URL in the sheet
- Rate limiting errors are handled with retries
- Connection errors are logged and handled gracefully
- Empty URLs are skipped and their screenshot URLs are cleared

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details 