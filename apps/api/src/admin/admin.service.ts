import AWS from 'aws-sdk';
import { In, Repository } from 'typeorm';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { BccnmNcasUpdate, STATUS, UserGuide } from '@ien/common';
import { InjectRepository } from '@nestjs/typeorm';
import { read, utils } from 'xlsx-js-style';
import { AppLogger } from '../common/logger.service';
import { BccnmNcasValidationRO } from './ro';
import { IENApplicant } from '../applicant/entity/ienapplicant.entity';

const BUCKET_NAME = process.env.DOCS_BUCKET ?? 'ien-dev-docs';

export class AdminService {
  private s3: AWS.S3;

  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(IENApplicant)
    private readonly applicantRepository: Repository<IENApplicant>,
  ) {
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
      throw new InternalServerErrorException('failed to get the list of user guides');
    }
  }

  async uploadUserGuide(name: string, file: Express.Multer.File): Promise<string> {
    try {
      const params = { Bucket: BUCKET_NAME, Key: name, Body: file.buffer };
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (e) {
      this.logger.error(e, 'S3');
      throw new InternalServerErrorException('failed to upload a user guide');
    }
  }

  async getSignedUrl(key: string, version?: string) {
    try {
      const params = { Bucket: BUCKET_NAME, Key: key, VersionId: version, Expires: 60 };
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (e) {
      this.logger.error(e, 'S3');
      throw new InternalServerErrorException('failed to get the signed url of a user guide');
    }
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
      throw new InternalServerErrorException('failed to get versions of a user guide');
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
      throw new InternalServerErrorException('failed to delete a user guide');
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
      throw new InternalServerErrorException('failed to restore a user guide');
    }
  }

  validateBccnmNcasUpdate(update: BccnmNcasUpdate, applicant: IENApplicant): BccnmNcasValidationRO {
    const v: BccnmNcasValidationRO = {
      ...update,
      message: '',
      valid: true,
    };

    if (!applicant) {
      v.valid = false;
      v.message = 'Applicant not found';
      return v;
    }

    const signedAt = update['Date ROS Contract Signed'];
    if (!signedAt) {
      v.valid = false;
      v.message = 'ROS contract signed date is required.';
      return v;
    }
    try {
      // convert excel date cell value as a number to string
      v['Date ROS Contract Signed'] = dayjs((+signedAt - 25568) * 86400 * 1000).format(
        'YYYY-MM-DD',
      );
    } catch {}

    const ros = applicant.applicant_status_audit.find(
      s => s.status.status === STATUS.COMPLETED_NCAS,
    );
    if (!ros) {
      v.message = `Add a milestone.`;
      return v;
    }
    if (!dayjs(ros.start_date).isSame(signedAt)) {
      v.message = `Update 'ROS contract signed date`;
    } else {
      v.valid = false;
      v.message = 'No changes';
    }
    return v;
  }

  async validateBccnmNcasUpdates(file: Express.Multer.File): Promise<BccnmNcasValidationRO[]> {
    const wb = read(file.buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = utils.sheet_to_json(ws, { blankrows: false });
    const data = rows.filter((row: any) => !!row['HMBC Unique ID']) as BccnmNcasUpdate[];
    const applicants = await this.applicantRepository
      .find({
        where: { id: In(data.map(e => e['HMBC Unique ID'])) },
        relations: ['applicant_status_audit', 'applicant_status_audit.status'],
      })
      .then(result => _.chain(result).keyBy('id').value());
    return data.map(e => {
      return this.validateBccnmNcasUpdate(e, applicants[e['HMBC Unique ID']]);
    });
  }
}
