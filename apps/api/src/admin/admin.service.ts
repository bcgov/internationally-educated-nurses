import AWS from 'aws-sdk';
import { Inject, Logger } from '@nestjs/common';
import { AppLogger } from '../common/logger.service';
import { UserGuide } from '@ien/common';

const BUCKET_NAME = process.env.BUCKET_NAME ?? 'ien-dev-docs';

export class AdminService {
  private s3: AWS.S3;

  constructor(@Inject(Logger) private readonly logger: AppLogger) {
    this.s3 = new AWS.S3({
      params: {
        Bucket: BUCKET_NAME,
      },
    });
  }

  async getUserGuides(): Promise<UserGuide[]> {
    return await new Promise((resolve, reject) => {
      this.s3.listObjects((e, data) => {
        if (e) {
          this.logger.error(e, 'S3');
          reject(e);
        } else {
          const files =
            data.Contents?.map(({ Key, LastModified, Size }) => {
              return { name: Key, lastModified: LastModified, size: Size };
            }) ?? [];
          resolve(files as UserGuide[]);
        }
      });
    });
  }

  async uploadUserGuide(name: string, file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: BUCKET_NAME,
          Key: name,
          Body: file.buffer,
        },
        (e, data) => {
          if (e) {
            this.logger.error(e, 'S3');
            reject(e);
          } else {
            resolve(data.Location);
          }
        },
      );
    });
  }

  getUserGuideStream(key: string) {
    return this.s3.getObject({ Bucket: BUCKET_NAME, Key: key }).createReadStream();
  }
}
