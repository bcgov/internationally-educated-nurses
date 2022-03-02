/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { ApplicantEntity } from '../entity/applicant.entity';
import { ApplicantAuditEntity } from '../entity/applicantAudit.entity';
import { ApplicantStatusAuditEntity } from '../entity/applicantStatusAudit.entity';

@EventSubscriber()
export class ApplicantSubscriber implements EntitySubscriberInterface<ApplicantEntity> {
  applicant!: ApplicantEntity;

  listenTo(): any {
    return ApplicantEntity;
  }

  beforeUpdate(event: UpdateEvent<any>) {
    delete event.entity?.added_by;
    delete event.entity?.added_by_id;
  }

  beforeInsert(event: InsertEvent<any>) {
    if (!event.entity.is_open) {
      event.entity.is_open = true;
    }
    if (!event.entity.status_date) {
      event.entity.status_date = new Date();
    }
  }

  async afterInsert(event: InsertEvent<any>) {
    try {
      await this.saveApplicantAudit(event);
      await this.saveApplicantStatusAudit(event);
    } catch (e) {}
  }

  async saveApplicantAudit(event: InsertEvent<any>) {
    const { added_by, added_by_id, ...dataToSave } = event.entity;
    try {
      const applicantAudit = new ApplicantAuditEntity();
      applicantAudit.applicant = event.entity;
      applicantAudit.data = dataToSave;
      applicantAudit.added_by = added_by;
      applicantAudit.added_by_id = added_by_id;
      await event.manager.getRepository(ApplicantAuditEntity).save(applicantAudit);
    } catch (e) {}
  }

  async saveApplicantStatusAudit(event: InsertEvent<any>) {
    try {
      const statusAudit = new ApplicantStatusAuditEntity();
      statusAudit.applicant = event.entity;
      statusAudit.status = event.entity.status;
      statusAudit.added_by = event.entity.added_by;
      statusAudit.added_by_id = event.entity.added_by_id;
      statusAudit.start_date = event.entity.status_date;
      await event.manager.getRepository(ApplicantStatusAuditEntity).save(statusAudit);
    } catch (e) {}
  }
}
