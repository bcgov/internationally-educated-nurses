/**
 * This subscriber listens to the IENApplicant entity and reverts the changes for the specified fields if the entity is marked as deleted.
 */
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { IENApplicant } from './ienapplicant.entity';

@EventSubscriber()
export class IENApplicantSubscriber implements EntitySubscriberInterface<IENApplicant> {
  listenTo() {
    return IENApplicant;
  }

  async beforeInsert(event: InsertEvent<IENApplicant>) {
    const { entity, manager } = event;

    // If there's no entity or the entity has no ats1_id do nothing
    if (!entity?.ats1_id) return;

    // Retrieve the original entity from the database
    const databaseEntity = await manager.findOne(IENApplicant, {
      where: { ats1_id: entity.ats1_id },
    });

    // If the original entity is found and it's marked as deleted,, revert the changes for the specified fields
    if (databaseEntity?.deleted_date) {
      entity.name = databaseEntity.name;
      entity.email_address = databaseEntity.email_address;
      entity.phone_number = databaseEntity.phone_number;
    }
  }
}
