// ienapplicant.subscriber.ts
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { IENApplicant } from './ienapplicant.entity';

@EventSubscriber()
export class IENApplicantSubscriber implements EntitySubscriberInterface<IENApplicant> {
  listenTo() {
    return IENApplicant;
  }

  beforeUpdate(event: UpdateEvent<IENApplicant>) {
    const entity = event.entity;
    const databaseEntity = event.databaseEntity;

    if (entity && databaseEntity && entity.deleted_date) {
      entity.name = databaseEntity.name;
      entity.email_address = databaseEntity.email_address;
      entity.phone_number = databaseEntity.phone_number;
    }
  }
}
