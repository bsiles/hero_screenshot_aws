import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
export class UploaderService {
    s3Client;
    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }
    async upload(screenshot) {
        const key = `screenshots/screenshot-${Date.now()}.png`;
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: screenshot,
            ContentType: 'image/png',
        });
        await this.s3Client.send(command);
        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
}
