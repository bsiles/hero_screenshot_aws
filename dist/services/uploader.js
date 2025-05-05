import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/aws.js";
import { readFile } from "fs/promises";
import path from "path";
export async function uploadToS3(filePath) {
    const buffer = await readFile(filePath);
    const filename = path.basename(filePath);
    const bucket = process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION || 'us-east-1';
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: `screenshots/${filename}`,
        Body: buffer,
        ContentType: "image/png",
        ACL: "public-read",
    });
    await s3.send(command);
    // Construct the S3 URL based on region
    const s3Domain = region === 'us-east-1'
        ? 's3.amazonaws.com'
        : `s3.${region}.amazonaws.com`;
    return `https://${bucket}.${s3Domain}/screenshots/${filename}`;
}
