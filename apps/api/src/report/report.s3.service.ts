// s3.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import AWS from 'aws-sdk';

const BUCKET_NAME = process.env.REPORTS_BUCKET ?? 'ien-dev-reports';

@Injectable()
export class ReportS3Service {
  private s3: AWS.S3 | null = null;

  constructor() {
    this.s3 = new AWS.S3({
      params: {
        Bucket: BUCKET_NAME,
      },
    });
  }

  async uploadFile(key: string, data: Record<string, any>): Promise<void> {
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
    try {
      const params: AWS.S3.PutObjectRequest = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(data),
      };
      this.s3
        .upload(params)
        .promise()
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Upload started.');
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error starting upload:', error);
        });
    } catch (e) {
      throw new InternalServerErrorException('failed to upload a report data');
    }
  }

  async generatePresignedUrl(key: string): Promise<string> {
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: 60 * 5, // URL expires in 5 minutes
    };
    return this.s3.getSignedUrl('getObject', params);
  }
}
