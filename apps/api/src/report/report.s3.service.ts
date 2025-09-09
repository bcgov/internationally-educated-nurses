// s3.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET_NAME = process.env.REPORTS_BUCKET ?? 'ien-dev-reports';

@Injectable()
export class ReportS3Service {
  private s3: S3Client | null = null;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_S3_REGION,
    });
  }

  async uploadFile(key: string, data: Record<string, unknown>): Promise<{ Location: string }> {
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: JSON.stringify(data),
        }),
      );
      return {
        Location: `https://${BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`,
      };
    } catch {
      throw new InternalServerErrorException('failed to upload a report data');
    }
  }

  async generatePresignedUrl(key: string): Promise<string> {
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 60 * 5 }); // URL expires in 5 minutes
  }
}
