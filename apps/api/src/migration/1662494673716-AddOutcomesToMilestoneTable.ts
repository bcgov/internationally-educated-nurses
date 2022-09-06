import { IENApplicantStatus } from "src/applicant/entity/ienapplicant-status.entity";
import { StatusCategory } from "src/common/util";
import { MigrationInterface, QueryRunner } from "typeorm"

export class AddOutcomesToMilestoneTable1662494673716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let milestones:any = [
            {
                "id": "7B97462B-8600-41F5-AAFD-3672B38C8C85",
                "name": "No position available"
            },
            {
                "id": "10277492-D10A-4EBD-9F50-39F4BE9D05F7",
                "name": "HA was not interested"
            },
            {
                "id": "049E5172-578D-49CE-BC0D-631C4FC1965C",
                "name": "Job competition cancelled"
            },
            {
                "id": "009761C9-A857-4E40-978A-9CBCC6F94E35",
                "name": "Candidate withdrew from the job competition"
            },
            {
                "id": "E26EC530-2019-44FC-9784-D565BDD3FFDE",
                "name": "Job offer accepted"
            }
        ]

        milestones = milestones.map((milestone:any)=>
        {
            return {
                id:milestone.id,
                status:milestone.name, 
                category: StatusCategory.FINAL,
                full_name:milestone.name
             }
        })
        await queryRunner.connection.createQueryBuilder().insert().into(IENApplicantStatus).values(milestones).execute(); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
