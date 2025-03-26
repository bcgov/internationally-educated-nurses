import AWS from 'aws-sdk';
import { In, Repository } from 'typeorm';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  BCCNM_LICENCE_ENUM,
  BccnmNcasUpdate,
  EmployeeRO,
  isoCountries,
  STATUS,
  UserGuide,
} from '@ien/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from '../common/logger.service';
import { BccnmNcasUpdateRO, BccnmNcasValidationRO } from './ro';
import { IENApplicant } from '../applicant/entity/ienapplicant.entity';
import { BccnmNcasUpdateDTO } from './dto';
import { IENApplicantService } from '../applicant/ienapplicant.service';
import { IENApplicantAddStatusAPIDTO } from '../applicant/dto';
import { IENApplicantStatus } from '../applicant/entity/ienapplicant-status.entity';
import { getDateFromCellValue } from '../common/util';
import { IENApplicantStatusAudit } from 'src/applicant/entity/ienapplicant-status-audit.entity';

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
      //throw new InternalServerErrorException('the feature is disabled');
      return [];
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
    const validation_result: BccnmNcasValidationRO = {
      id: update['HMBC Unique ID'],
      applicantId: applicant?.id,
      name: `${update['First Name'] ?? ''} ${update['Last Name'] ?? ''}`,
      dateOfRosContract: '',
      designation: update['Registration Designation']?.toString() ?? '',
      appliedToBccnm: undefined,
      ncasCompleteDate: undefined,
      countryOfEducation: update['ISO Code - Education'] ?? '',
      valid: false,
      message: '',
    };
    this.validateLicensingDates(update, applicant, validation_result);
    try {
      validation_result.appliedToBccnm = getDateFromCellValue(
        update['Date BCCNM Application Complete'],
      );
    } catch (e) {
      validation_result.message = e.message;
    }

    try {
      validation_result.ncasCompleteDate = getDateFromCellValue(
        update['Date NCAS Assessment Complete'],
      );
    } catch (e) {
      validation_result.message = e.message;
    }

    if (!applicant) {
      validation_result.message = 'Applicant not found';
      return validation_result;
    }

    // convert excel date cell value as a number to string
    try {
      validation_result.dateOfRosContract = getDateFromCellValue(
        update['Date ROS Contract Signed'],
      );
      if (validation_result.dateOfRosContract) {
        const ros = applicant.applicant_status_audit.find(
          s => s.status.status === STATUS.SIGNED_ROS,
        );
        if (ros) {
          if (
            !ros.notes?.includes('Updated by BCCNM') ||
            dayjs(validation_result.dateOfRosContract).isSame(ros.start_date)
          ) {
            validation_result.dateOfRosContract = undefined; // do not overwrite ROS milestone set by ATS
          } else {
            validation_result.rosStatusId = ros.id;
          }
        }
      }
    } catch (e) {
      validation_result.message = e.message;
    }

    // do not overwrite 'bccnm/ncas' completion date
    if (
      validation_result.appliedToBccnm &&
      applicant.applicant_status_audit.find(s => s.status.status === STATUS.APPLIED_TO_BCCNM)
    ) {
      validation_result.appliedToBccnm = undefined;
    }

    if (
      validation_result.ncasCompleteDate &&
      applicant.applicant_status_audit.find(s => s.status.status === STATUS.COMPLETED_NCAS)
    ) {
      validation_result.ncasCompleteDate = undefined;
    }

    if (
      validation_result.bccnmApplicationCompleteDate &&
      applicant.applicant_status_audit.find(
        s => s.status.status === STATUS.BCCNM_APPLICATION_COMPLETE_DATE,
      )
    ) {
      validation_result.bccnmApplicationCompleteDate = undefined;
    }

    if (validation_result.countryOfEducation) {
      if (
        !isoCountries[
          validation_result.countryOfEducation.toUpperCase() as keyof typeof isoCountries
        ]
      ) {
        validation_result.message = `Invalid country code: ${validation_result.countryOfEducation}`;
        validation_result.countryOfEducation = undefined;
      } else if (
        applicant.nursing_educations?.some(
          e => e.country?.toLowerCase() === validation_result.countryOfEducation?.toLowerCase(),
        )
      ) {
        validation_result.countryOfEducation = undefined;
      }
    }

    if (
      !validation_result.appliedToBccnm &&
      !validation_result.dateOfRosContract &&
      !validation_result.ncasCompleteDate &&
      !validation_result.bccnmApplicationCompleteDate &&
      !validation_result.countryOfEducation &&
      !validation_result.bccnmFullLicenceLPN &&
      !validation_result.bccnmFullLicenceRN &&
      !validation_result.bccnmFullLicenceRPN &&
      !validation_result.bccnmProvisionalLicenceLPN &&
      !validation_result.bccnmProvisionalLicenceRN &&
      !validation_result.bccnmProvisionalLicenceRPN &&
      !validation_result.message
    ) {
      validation_result.message = 'No changes';
    }

    validation_result.valid = !validation_result.message;

    return validation_result;
  }

  async validateBccnmNcasUpdates(rows: BccnmNcasUpdate[]): Promise<BccnmNcasValidationRO[]> {
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

  getExistingMilestoneFromApplicant(
    applicant: IENApplicant,
    status: BCCNM_LICENCE_ENUM,
  ): IENApplicantStatusAudit | undefined {
    const foundStatus = applicant?.applicant_status_audit.find(
      s => s.status.status === status.toString(),
    );
    return foundStatus;
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
          notes: `${notes}\nRegistration designation: ${update.designation}`,
        } as IENApplicantAddStatusAPIDTO;
        if (update.rosStatusId) {
          await this.applicantService.updateApplicantStatus(user, update.rosStatusId, rosMilestone);
          updated += 1;
        } else if (update.dateOfRosContract) {
          await this.applicantService.addApplicantStatus(user, update.applicantId, rosMilestone);
          created += 1;
        }

        const statusUpdates = [
          {
            field: update?.appliedToBccnm,
            status: STATUS.APPLIED_TO_BCCNM,
          },
          {
            field: update?.ncasCompleteDate,
            status: STATUS.COMPLETED_NCAS,
          },
          {
            field: update?.bccnmApplicationCompleteDate,
            status: STATUS.BCCNM_APPLICATION_COMPLETE_DATE,
          },
          {
            field: update?.bccnmDecisionDate,
            status: STATUS.BCCNM_DECISION_DATE,
          },
        ];

        const registrationUpdates = [
          {
            field: update.bccnmFullLicenceLPN,
            status: STATUS.BCCNM_FULL_LICENCE_LPN,
            statusId: update.bccnmFullLicenceLPNID,
          },
          {
            field: update.bccnmFullLicenceRN,
            status: STATUS.BCCNM_FULL_LICENCE_RN,
            statusId: update.bccnmFullLicenceRNID,
          },
          {
            field: update.bccnmFullLicenceRPN,
            status: STATUS.BCCMN_FULL_LICENCE_RPN,
            statusId: update.bccnmFullLicenceRPNID,
          },
          {
            field: update.bccnmProvisionalLicenceLPN,
            status: STATUS.BCCNM_PROVISIONAL_LICENCE_LPN,
            statusId: update.bccnmProvisionalLicenceLPNID,
          },
          {
            field: update.bccnmProvisionalLicenceRN,
            status: STATUS.BCCNM_PROVISIONAL_LICENCE_RN,
            statusId: update.bccnmProvisionalLicenceRNID,
          },
          {
            field: update.bccnmProvisionalLicenceRPN,
            status: STATUS.BCCNM_PROVISIONAL_LICENCE_RPN,
            statusId: update.bccnmProvisionalLicenceRPNID,
          },
        ];
        for (const { field, status } of statusUpdates) {
          if (field) {
            await this.handleStatusUpdates(field, status, notes, user, update.applicantId);
            created++;
          }
        }

        for (const { field, status, statusId } of registrationUpdates) {
          if (field) {
            await this.handleRegistrationUpdates(
              field,
              status,
              statusId ?? '',
              notes,
              user,
              update.applicantId,
            );
            statusId ? updated++ : created++;
          }
        }
        if (update.countryOfEducation) {
          const result = await this.applicantService.addEducationCountry(
            update.applicantId,
            update.countryOfEducation,
          );
          switch (result) {
            case 0:
              updated++;
              break;
            case 1:
              created++;
              break;
            default:
              break;
          }
        }

        response.created += created;
        response.updated += updated;
        response.ignored += updated + created === 0 ? 1 : 0;
      }),
    );
    return response;
  }

  async handleStatusUpdates(
    field: string,
    status: string,
    notes: string,
    user: EmployeeRO,
    applicantId: string,
  ) {
    const data = {
      start_date: field,
      status,
      notes,
    };
    await this.applicantService.addApplicantStatus(user, applicantId, data);
  }
  async handleRegistrationUpdates(
    field: string,
    status: STATUS,
    statusId: string,
    notes: string,
    user: EmployeeRO,
    applicantId: string,
  ) {
    const data = {
      start_date: field,
      status,
      notes,
    };
    if (statusId) {
      await this.applicantService.updateApplicantStatus(user, statusId, data);
    } else {
      await this.applicantService.addApplicantStatus(user, applicantId, data);
    }
  }

  validateLicensingDates(
    update: BccnmNcasUpdate,
    applicant: IENApplicant,
    validation_result: BccnmNcasValidationRO,
  ) {
    const registration_statuses = [
      BCCNM_LICENCE_ENUM.BCCNM_FULL_LICENCE_LPN,
      BCCNM_LICENCE_ENUM.BCCNM_FULL_LICENCE_RN,
      BCCNM_LICENCE_ENUM.BCCMN_FULL_LICENCE_RPN,
      BCCNM_LICENCE_ENUM.BCCNM_PROVISIONAL_LICENCE_LPN,
      BCCNM_LICENCE_ENUM.BCCNM_PROVISIONAL_LICENCE_RN,
      BCCNM_LICENCE_ENUM.BCCNM_PROVISIONAL_LICENCE_RPN,
    ];

    registration_statuses.forEach((status: BCCNM_LICENCE_ENUM) => {
      const outcome = this.validateLicensingDate(update, status, applicant);
      // IF there is no value for the cell or if
      if (!outcome || outcome.date === outcome.match?.start_date?.toString()) return;
      switch (status) {
        case BCCNM_LICENCE_ENUM.BCCNM_FULL_LICENCE_LPN:
          validation_result.bccnmFullLicenceLPN = outcome.date;
          validation_result.bccnmFullLicenceLPNID = outcome?.match?.id || '';
          break;
        case BCCNM_LICENCE_ENUM.BCCNM_FULL_LICENCE_RN:
          validation_result.bccnmFullLicenceRN = outcome.date;
          validation_result.bccnmFullLicenceRNID = outcome?.match?.id || '';
          break;
        case BCCNM_LICENCE_ENUM.BCCMN_FULL_LICENCE_RPN:
          validation_result.bccnmFullLicenceRPN = outcome.date;
          validation_result.bccnmFullLicenceRPNID = outcome?.match?.id || '';
          break;
        case BCCNM_LICENCE_ENUM.BCCNM_PROVISIONAL_LICENCE_LPN:
          validation_result.bccnmProvisionalLicenceLPN = outcome.date;
          validation_result.bccnmProvisionalLicenceLPNID = outcome?.match?.id || '';
          break;
        case BCCNM_LICENCE_ENUM.BCCNM_PROVISIONAL_LICENCE_RN:
          validation_result.bccnmProvisionalLicenceRN = outcome.date;
          validation_result.bccnmProvisionalLicenceRNID = outcome?.match?.id || '';
          break;
        case BCCNM_LICENCE_ENUM.BCCNM_PROVISIONAL_LICENCE_RPN:
          validation_result.bccnmProvisionalLicenceRPN = outcome.date;
          validation_result.bccnmFullLicenceRPNID = outcome?.match?.id || '';
          break;
      }
    });
  }
  validateLicensingDate(
    update: BccnmNcasUpdate,
    status: BCCNM_LICENCE_ENUM,
    applicant: IENApplicant,
  ) {
    const date = getDateFromCellValue(update[status] ?? '');
    if (!date) return;
    const match = this.getExistingMilestoneFromApplicant(applicant, status);
    return { match, date };
  }
}
