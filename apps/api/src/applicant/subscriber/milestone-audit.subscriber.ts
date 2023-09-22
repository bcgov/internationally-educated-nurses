import dayjs from 'dayjs';
import { EntitySubscriberInterface, EventSubscriber, getRepository, UpdateEvent } from 'typeorm';
import { IENApplicantStatusAudit } from '../entity/ienapplicant-status-audit.entity';
import { MilestoneAuditEntity } from '../entity/milestone-audit.entity';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

@EventSubscriber()
export class MilestoneAuditSubscriber
  implements EntitySubscriberInterface<IENApplicantStatusAudit>
{
  listenTo() {
    return IENApplicantStatusAudit;
  }

  getFieldValue(
    entity: IENApplicantStatusAudit | ObjectLiteral | undefined,
    field: keyof IENApplicantStatusAudit,
  ) {
    if (entity) {
      const value: any = entity[field];
      if (value?.id !== undefined) {
        return value.id;
      }
      if (dayjs(value).isValid()) {
        return dayjs(value).format('YYYY-MM-DD');
      }
      return value;
    }
    return null;
  }

  async beforeUpdate(event: UpdateEvent<IENApplicantStatusAudit>) {
    if (event.entity) {
      const audits = Object.keys(event.databaseEntity)
        .filter(key => !['created_date', 'updated_date'].includes(key))
        .map(key => {
          const field = key as keyof IENApplicantStatusAudit;
          const isForeignKey = (event.databaseEntity[field] as any)?.id !== undefined;

          const oldValue = this.getFieldValue(event.databaseEntity, field);
          const newValue = this.getFieldValue(event.entity, field);

          if (oldValue !== newValue) {
            return {
              table: event.metadata.tableName,
              field: isForeignKey ? `${field}_id` : field,
              record_id: event.databaseEntity.id,
              old_value: oldValue,
              new_value: dayjs(newValue).isValid()
                ? dayjs(newValue).format('YYYY-MM-DD')
                : newValue,
            };
          }
        })
        .filter(v => v) as Partial<MilestoneAuditEntity>[];

      await getRepository(MilestoneAuditEntity).insert(audits);
    }
  }
}
