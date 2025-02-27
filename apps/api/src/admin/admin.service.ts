import AWS from 'aws-sdk';
import { In, Repository } from 'typeorm';
import _ from 'lodash';
import dayjs from 'dayjs';
import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { BccnmNcasUpdate, EmployeeRO, isoCountries, STATUS, UserGuide } from '@ien/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppLogger } from '../common/logger.service';
import { BccnmNcasUpdateRO, BccnmNcasValidationRO } from './ro';
import { IENApplicant } from '../applicant/entity/ienapplicant.entity';
import { BccnmNcasUpdateDTO } from './dto';
import { IENApplicantService } from '../applicant/ienapplicant.service';
import { IENApplicantAddStatusAPIDTO } from '../applicant/dto';
import { IENApplicantStatus } from '../applicant/entity/ienapplicant-status.entity';
import { getDateFromCellValue } from '../common/util';

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
    const v: BccnmNcasValidationRO = {
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
      bccnmFullLicenceLPN:getDateFromCellValue(update['BCCNM Full License LPN']??''),
      bccnmFullLicenceRN:getDateFromCellValue(update['BCCNM Full License RN']??''),
      bccnmFullLicenceRPN:getDateFromCellValue(update['BCCNM Full License RPN']??''),
      bccnmProvisionalLicenceLPN:getDateFromCellValue(update['BCCNM Provisional License LPN']??''),
      bccnmProvisionalLicenceRN:getDateFromCellValue(update['BCCNM Provisional License RN']??''),
      bccnmProvisionalLicenceRPN:getDateFromCellValue(update['BCCNM Provisional License RPN']??''),
      bccnmApplicationCompleteDate: getDateFromCellValue(
        update['Date BCCNM Application Complete'] ?? '',
      ),
    };
    v.bccnmFullLicenceLPNID= v.bccnmFullLicenceLPN ? this.getMilstoneIDFromApplicant(applicant,STATUS.BCCNM_FULL_LICENCE_LPN) :'';
    v.bccnmFullLicenceRPNID= v.bccnmFullLicenceRPN ? this.getMilstoneIDFromApplicant(applicant,STATUS.BCCMN_FULL_LICENCE_RPN) :'';
    v.bccnmFullLicenceRNID= v.bccnmFullLicenceRN ? this.getMilstoneIDFromApplicant(applicant,STATUS.BCCNM_FULL_LICENCE_RN) :'';
    v.bccnmProvisionalLicenceLPNID= v.bccnmProvisionalLicenceLPN ? this.getMilstoneIDFromApplicant(applicant,STATUS.BCCNM_PROVISIONAL_LICENCE_LPN) :'';
    v.bccnmProvisionalLicenceRPNID= v.bccnmProvisionalLicenceRPN ? this.getMilstoneIDFromApplicant(applicant,STATUS.BCCNM_PROVISIONAL_LICENCE_RPN) :'';
    v.bccnmProvisionalLicenceRNID= v.bccnmProvisionalLicenceRN ? this.getMilstoneIDFromApplicant(applicant,STATUS.BCCNM_PROVISIONAL_LICENCE_RN) :'';
    try {
      v.appliedToBccnm = getDateFromCellValue(update['Date BCCNM Application Complete']);
    } catch (e) {
      v.message = e.message;
    }

    try {
      v.ncasCompleteDate = getDateFromCellValue(update['Date NCAS Assessment Complete']);
    } catch (e) {
      v.message = e.message;
    }

    if (!applicant) {
      v.message = 'Applicant not found';
      return v;
    }

  
    // convert excel date cell value as a number to string
    try {
      v.dateOfRosContract = getDateFromCellValue(update['Date ROS Contract Signed']);
      if (v.dateOfRosContract) {
        const ros = applicant.applicant_status_audit.find(
          s => s.status.status === STATUS.SIGNED_ROS,
        );
        if (ros) {
          if (
            !ros.notes?.includes('Updated by BCCNM') ||
            dayjs(v.dateOfRosContract).isSame(ros.start_date)
          ) {
            v.dateOfRosContract = undefined; // do not overwrite ROS milestone set by ATS
          } else {
            v.rosStatusId= ros.id;
          }
        }
      }
    } catch (e) {
      v.message = e.message;
    }

    // do not overwrite 'bccnm/ncas' completion date
    if (
      v.appliedToBccnm &&
      applicant.applicant_status_audit.find(s => s.status.status === STATUS.APPLIED_TO_BCCNM)
    ) {
      v.appliedToBccnm = undefined;
    }

    if (
      v.ncasCompleteDate &&
      applicant.applicant_status_audit.find(s => s.status.status === STATUS.COMPLETED_NCAS)
    ) {
      v.ncasCompleteDate = undefined;
    }

    if (
      v.bccnmApplicationCompleteDate &&
      applicant.applicant_status_audit.find(
        s => s.status.status === STATUS.BCCNM_APPLICATION_COMPLETE_DATE,
      )
    ) {
      v.bccnmApplicationCompleteDate = undefined;
    }


    if (v.countryOfEducation) {
      if (!isoCountries[v.countryOfEducation.toUpperCase() as keyof typeof isoCountries]) {
        v.message = `Invalid country code: ${v.countryOfEducation}`;
        v.countryOfEducation = undefined;
      } else if (
        applicant.nursing_educations?.some(
          e => e.country?.toLowerCase() === v.countryOfEducation?.toLowerCase(),
        )
      ) {
        v.countryOfEducation = undefined;
      }
    }

    if (
      !v.appliedToBccnm &&
      !v.dateOfRosContract &&
      !v.ncasCompleteDate &&
      !v.bccnmApplicationCompleteDate &&
      !v.countryOfEducation &&
      !v.bccnmFullLicenceLPN && 
      !v.bccnmFullLicenceRN && 
      !v.bccnmFullLicenceRPN && 
      !v.bccnmProvisionalLicenceLPN && 
      !v.bccnmProvisionalLicenceRN && 
      !v.bccnmProvisionalLicenceRPN && 
      !v.message
    ) {
      v.message = 'No changes';
    }

    v.valid = !v.message;

    return v;
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

 getMilstoneIDFromApplicant(applicant:IENApplicant,status:STATUS):string{
  let foundStatus = applicant.applicant_status_audit.find(
    s => s.status.status === status?.toString(),
  );
  return foundStatus?.id || '';
 }

  async applyBccnmNcasUpdates(
    user: EmployeeRO,
    { data }: BccnmNcasUpdateDTO,
  ): Promise<BccnmNcasUpdateRO> {
    const response = { created: 0, updated: 0, ignored: 0 };
    console.log(data);
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
        if (update.rosStatusID) {
          await this.applicantService.updateApplicantStatus(user, update.rosStatusID, rosMilestone);
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
            status: STATUS.BCCNM_DECISION_DATE 
          },
        ];

        const registrationUpdates = [
          {
            field: update?.bccnmFullLicenceLPN,
            status: STATUS.BCCNM_FULL_LICENCE_LPN,
            statusId: update.bccnmFullLicenceLPNID
          },
          {
            field: update?.bccnmFullLicenceRN,
            status: STATUS.BCCNM_FULL_LICENCE_RN,
            statusId: update.bccnmFullLicenceRNID
          },
          {
            field: update?.bccnmFullLicenceRPN,
            status: STATUS.BCCMN_FULL_LICENCE_RPN,
            statusId: update.bccnmFullLicenceRPNID
          },
          {
            field: update?.bccnmProvisionalLicenceLPN,
            status: STATUS.BCCNM_PROVISIONAL_LICENCE_LPN,
            statusId: update.bccnmProvisionalLicenceLPNID
          },
          {
            field: update?.bccnmProvisionalLicenceRN,
            status: STATUS.BCCNM_PROVISIONAL_LICENCE_RN,
            statusId: update.bccnmProvisionalLicenceRNID
          },
          {
            field: update?.bccnmProvisionalLicenceRPN,
            status: STATUS.BCCNM_PROVISIONAL_LICENCE_RPN,
            statusId: update.bccnmProvisionalLicenceRPNID
          },
        ]
        for (const { field, status } of statusUpdates) {
          if (field) {
            const data = {
              start_date: field,
              status,
              notes,
            };
            await this.applicantService.addApplicantStatus(user, update.applicantId, data);
            created += 1;
          }
        }
        for (const { field, status,statusId } of registrationUpdates) {
          if (field) {
            const data = {
              start_date: field,
              status,
              notes,
            };
            if(statusId){
              console.log('Updating....', statusId,)
              await this.applicantService.updateApplicantStatus(user, statusId, data);
              created += 1;
            }else{
              await this.applicantService.addApplicantStatus(user, update.applicantId, data);
              updated += 1;
            }
          }
        }
        if (update.countryOfEducation) {
          const result = await this.applicantService.addEducationCountry(
            update.applicantId,
            update.countryOfEducation,
          );
          if (result === 1) {
            created += 1;
          } else if (result === 0) {
            updated += 1;
          }
        }

        response.created += created;
        response.updated += updated;
        response.ignored += updated + created === 0 ? 1 : 0;
      }),
    );
    return response;
  }
}
