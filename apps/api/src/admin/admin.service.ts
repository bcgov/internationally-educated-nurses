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
    try {
      const result = await this.s3.listObjects().promise();

      return (
        result.Contents?.map(o => {
          return { name: o.Key, lastModified: o.LastModified, size: o.Size } as UserGuide;
        }) ?? []
      );
    } catch (e) {
      this.logger.error(e, 'S3');
      throw e;
    }
  }

  async uploadUserGuide(name: string, file: Express.Multer.File): Promise<string> {
    try {
      const params = { Bucket: BUCKET_NAME, Key: name, Body: file.buffer };
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (e) {
      this.logger.error(e, 'S3');
      throw e;
    }
  }

  getUserGuideStream(key: string, version?: string) {
    const queryParams: AWS.S3.GetObjectRequest = { Bucket: BUCKET_NAME, Key: key };
    if (version) queryParams.VersionId = version;

    return this.s3.getObject(queryParams).createReadStream();
  }

  async getVersions(key: string): Promise<UserGuide[]> {
    try {
      const queryParams: AWS.S3.ListObjectVersionsRequest = { Bucket: BUCKET_NAME, Prefix: key };

      const version = await this.s3.listObjectVersions(queryParams).promise();

      return (
        version.Versions?.filter(v => v.Key === key).map(
          v =>
            ({
              name: v.Key,
              size: v.Size,
              lastModified: v.LastModified,
              version: v.VersionId,
            } as UserGuide),
        ) || []
      );
    } catch (e) {
      this.logger.error(e, 'S3');
      throw e;
    }
  }

  async deleteUserGuide(key: string, version?: string) {
    try {
      const params: AWS.S3.DeleteObjectRequest = {
        Bucket: BUCKET_NAME,
        Key: key,
      };
      if (version) params.VersionId = version;

      await this.s3.deleteObject(params).promise();
    } catch (e) {
      this.logger.error(e, 'S3');
      throw e;
    }
  }

  async restoreUserGuide(key: string, version: string) {
    try {
      const params: AWS.S3.CopyObjectRequest = {
        Bucket: BUCKET_NAME,
        CopySource: encodeURI(`/${BUCKET_NAME}/${key}?versionId=${version}`),
        Key: key,
      };
      await this.s3.copyObject(params).promise();
      await this.deleteUserGuide(key, version);
    } catch (e) {
      this.logger.error(e, 'S3');
      throw e;
    }
  }
}
