# Website Screenshot Tool

A Node.js tool that captures screenshots of websites and uploads them to AWS S3. This tool is specifically designed to capture hero sections of websites with precision and reliability.

## Features

- Captures hero sections of websites with exact dimensions
- Handles dynamic content loading with built-in delays
- Supports full viewport width capture for clean edges
- Automatic scroll position calculation for accurate section capture
- Uploads screenshots to AWS S3 with proper content type
- Returns public URLs for immediate access to screenshots
- Configurable through environment variables
- TypeScript support for better development experience

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with S3 access
- S3 bucket with appropriate permissions

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
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

4. Run the tool:
```bash
npm run dev -- --url https://example.com
```

## Environment Variables

- `AWS_REGION`: Your AWS region (e.g., us-east-2)
- `AWS_BUCKET_NAME`: Your S3 bucket name
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key

## Usage

```bash
npm run dev -- --url <website-url>
```

The tool will:
1. Navigate to the specified website
2. Wait for dynamic content to load
3. Locate and capture the hero section with precise dimensions
4. Upload the screenshot to your S3 bucket
5. Return a public URL for the screenshot

### Example Output
```
Screenshot captured successfully!
Uploaded to S3 bucket: your-bucket-name
Public URL: https://your-bucket-name.s3.your-region.amazonaws.com/screenshots/screenshot.png
```

## Technical Details

- Uses Playwright for reliable web page capture
- Implements smart waiting for dynamic content
- Calculates exact dimensions based on hero section
- Handles viewport and scroll position automatically
- Supports modern web technologies and responsive designs

## Security

- Never commit your `.env` file to version control
- Keep your AWS credentials secure
- Use IAM roles with minimal required permissions
- Consider using AWS Secrets Manager for production deployments

## Development

The project is built with:
- TypeScript for type safety
- Playwright for web automation
- AWS SDK for S3 integration
- Dotenv for environment management

## Contributing

Feel free to submit issues and enhancement requests! 