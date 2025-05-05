import { S3Client } from "@aws-sdk/client-s3";
if (!process.env.S3_BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME environment variable is required');
}
export const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
