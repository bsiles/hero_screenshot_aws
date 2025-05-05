# Website Screenshot Agent

A Node.js tool that captures full-page screenshots of websites and uploads them to AWS S3.

## Prerequisites

- Node.js 18 or higher (ESM modules)
- AWS account with S3 access
- S3 bucket with public read access
- AWS IAM user/role with the following permissions:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject",
          "s3:GetObject"
        ],
        "Resource": "arn:aws:s3:::your-bucket-name/*"
      }
    ]
  }
  ```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # AWS Credentials
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_REGION=us-east-1

   # S3 Configuration
   S3_BUCKET_NAME=your-bucket-name
   S3_BUCKET_URL=https://your-bucket-name.s3.amazonaws.com

   # Screenshot Configuration
   SCREENSHOT_WIDTH=1920
   SCREENSHOT_HEIGHT=1080
   ```

3. Configure your S3 bucket for public read access:
   - Go to your bucket's "Permissions" tab
   - Under "Block public access", click "Edit" and uncheck "Block all public access"
   - Save changes
   - Under "Bucket policy", add a policy like this:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::your-bucket-name/*"
         }
       ]
     }
     ```

4. Build the project:
   ```bash
   npm run build
   ```

## Usage

Run the tool with a URL as an argument:

```bash
npm start -- https://example.com
```

Or in development mode:

```bash
npm run dev -- https://example.com
```

The tool will:
1. Capture a full-page screenshot of the provided URL
2. Upload the screenshot to your S3 bucket
3. Return the public URL of the uploaded screenshot

## Features

- Full-page screenshot capture
- Configurable viewport size
- Automatic S3 upload with public URL generation
- Error handling and logging
- ESM modules support 