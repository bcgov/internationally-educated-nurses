import AWS from 'aws-sdk';
import { In, Repository } from 'typeorm';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { BccnmNcasUpdate, EmployeeRO, STATUS, UserGuide } from '@ien/common';
import { InjectRepository } from '@nestjs/typeorm';
import { read, utils } from 'xlsx-js-style';
import { AppLogger } from '../common/logger.service';
import { BccnmNcasUpdateRO, BccnmNcasValidationRO } from './ro';
import { IENApplicant } from '../applicant/entity/ienapplicant.entity';
import { BccnmNcasUpdateDTO } from './dto';
import { IENApplicantService } from '../applicant/ienapplicant.service';
import { IENApplicantAddStatusAPIDTO } from '../applicant/dto';
import { IENApplicantStatus } from '../applicant/entity/ienapplicant-status.entity';

const BUCKET_NAME = process.env.DOCS_BUCKET ?? 'ien-dev-docs';

export class AdminService {
  private s3: AWS.S3 | null = null;

  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(IENApplicant)
    private readonly applicantRepository: Repository<IENApplicant>,
    @InjectRepository(IENApplicantStatus)
    readonly ienApplicantStatusRepository: Repository<IENApplicantStatus>,
    @Inject(IENApplicantService)
    private readonly applicantService: IENApplicantService,
  ) {
    if (process.env.DOCS_BUCKET) {
      this.s3 = new AWS.S3({
        params: {
          Bucket: BUCKET_NAME,
        },
      });
    }
  }

  async getUserGuides(): Promise<UserGuide[]> {
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
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
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
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
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
    try {
      const params = { Bucket: BUCKET_NAME, Key: key, VersionId: version, Expires: 60 };
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (e) {
      this.logger.error(e, 'S3');
      throw new InternalServerErrorException('failed to get the signed url of a user guide');
    }
  }

  async getVersions(key: string): Promise<UserGuide[]> {
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
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
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
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
    if (!this.s3) {
      throw new InternalServerErrorException('the feature is disabled');
    }
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
      id: update['HMBC Unique ID'],
      applicantId: applicant?.id,
      name: `${update['First Name'] ?? ''} ${update['Last Name'] ?? ''}`,
      dateOfRosContract: '',
      designation: update['Registration Designation'] ?? '',
      appliedToBccnm: update['BCCNM Application Complete']?.toLowerCase().trim() === 'yes',
      ncasComplete: update['NCAS Assessment Complete']?.toLowerCase().trim() === 'yes',
      valid: false,
      message: 'No updates',
    };

    if (!applicant) {
      v.message = 'Applicant not found';
      return v;
    }

    // convert excel date cell value as a number to string
    const dateOfRosContract = update['Date ROS Contract Signed'];
    if (typeof dateOfRosContract === 'number') {
      // 25568 -> number of days from 1990 to epoch at PST
      v.dateOfRosContract = dayjs((+dateOfRosContract - 25568) * 86400 * 1000).format('YYYY-MM-DD');
    } else if (dateOfRosContract) {
      try {
        v.dateOfRosContract = dayjs(dateOfRosContract.trim()).format('YYYY-MM-DD');
      } catch (e) {
        v.message = 'Invalid date format';
      }
    }

    if (v.dateOfRosContract) {
      const ros = applicant.applicant_status_audit.find(s => s.status.status === STATUS.SIGNED_ROS);
      if (!ros || !dayjs(v.dateOfRosContract).isSame(ros.start_date)) {
        v.message = '';
        v.statusId = ros?.id; // pass id to identify it should be updated.
      }
    }

    v.appliedToBccnm =
      v.appliedToBccnm &&
      !applicant.applicant_status_audit.find(s => s.status.status === STATUS.APPLIED_TO_BCCNM);
    v.ncasComplete =
      v.ncasComplete &&
      !applicant.applicant_status_audit.find(s => s.status.status === STATUS.COMPLETED_NCAS);

    if (v.appliedToBccnm || v.ncasComplete || !v.message) {
      v.valid = true;
    }

    return v;
  }

  async validateBccnmNcasUpdates(file: Express.Multer.File): Promise<BccnmNcasValidationRO[]> {
    const wb = read(file.buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = utils.sheet_to_json<BccnmNcasUpdate>(ws, { blankrows: false });
    const data = rows.filter(row => !!row['HMBC Unique ID']);
    const applicants = await this.applicantRepository
      .find({
        where: { ats1_id: In(data.map(e => e['HMBC Unique ID'])) },
        relations: ['applicant_status_audit', 'applicant_status_audit.status'],
      })
      .then(result => _.chain(result).keyBy('ats1_id').value());
    return data.map(e => {
      return this.validateBccnmNcasUpdate(e, applicants[e['HMBC Unique ID']]);
    });
  }

  async applyBccnmNcasUpdates(
    user: EmployeeRO,
    { data }: BccnmNcasUpdateDTO,
  ): Promise<BccnmNcasUpdateRO> {
    const response = { created: 0, updated: 0, ignored: 0 };
    await Promise.all(
      data.map(async update => {
        const notes = `Updated by BCCNM/NCAS data upload at ${dayjs().format(
          'YYYY-MM-DD HH:mm:ss',
        )}`;
        let created = 0,
          updated = 0;

        const rosMilestone = {
          start_date: update.dateOfRosContract,
          status: STATUS.SIGNED_ROS,
          notes: `Registration designation: ${update.designation}\n${notes}`,
        } as IENApplicantAddStatusAPIDTO;
        if (update.statusId) {
          await this.applicantService.updateApplicantStatus(user, update.statusId, rosMilestone);
          updated += 1;
        } else if (update.dateOfRosContract) {
          await this.applicantService.addApplicantStatus(user, update.applicantId, rosMilestone);
          created += 1;
        }

        if (update.appliedToBccnm) {
          const appliedToBccnm = {
            start_date: dayjs().format('YYYY-MM-DD'),
            status: STATUS.APPLIED_TO_BCCNM,
            notes,
          };
          await this.applicantService.addApplicantStatus(user, update.applicantId, appliedToBccnm);
          created += 1;
        }

        if (update.ncasComplete) {
          const ncasComplete = {
            start_date: dayjs().format('YYYY-MM-DD'),
            status: STATUS.COMPLETED_NCAS,
            notes,
          };
          await this.applicantService.addApplicantStatus(user, update.applicantId, ncasComplete);
          created += 1;
        }

        response.created += created;
        response.updated += updated;
        response.ignored += updated + created === 0 ? 1 : 0;
      }),
    );
    return response;
  }
}
