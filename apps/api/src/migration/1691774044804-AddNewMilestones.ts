import { StatusCategory } from "@ien/common"
import { IENApplicantStatus } from "src/applicant/entity/ienapplicant-status.entity"
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddNewMilestones1691774044804 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.manager.createQueryBuilder().update(IENApplicantStatus)
            .where('id in (:...id)',{id:[
                '1651CAD1-1E56-4C79-92CE-F548AD9EC52C', // Sent employer documents to HMBC
                '4D435C42-F588-4174-BB1E-1FE086B23214', // Sent First Steps document to candidate
                'DA813B28-F617-4B5C-8E05-84F0AE3C9429', // Sent Second Steps document to candidate
                'E68F902C-8440-4A9C-A05F-2765301DE800', // Applied to NNAS 
                '897156C7-958C-4EC0-879A-ED4943AF7B72', // Submitted Documents (NNAS Application in Review)
                '20268C6E-145E-48CD-889A-2346985DB957', // Recieved NNAS Report 
                'DA06889E-55A1-4FF2-9984-80AE23D7E44B', // Completed English Language Requirement
                '61150E8A-6E83-444A-9DAB-3129A8CC0719', // Completed Computer-Based Assesment (CBA)
                '9066B792-6FBF-4E60-803F-0554E4B4DBA9', // Completed Simulation Lab Assessment (SLA)
                '8024ED3A-803F-4E34-9934-C29565DAAF63', // Referred to Additional Education
                '59263418-77EA-411F-894D-C84B5E1F710F', // Completed Additional Education
                '4189CA04-C1E1-4C22-9D6B-8AFD80130313', // Referred to Registration Exam
                '0D6BCFE1-FB00-45CB-A9C6-C6A53DA12E62', // NCLEX - Written
                'B0D38AA5-B776-4033-97F7-9894E9B33A3C', // NCLEX - Passed
                'D9AD22CD-7629-67EA-5734-3A05E77A47F6', // REx-PN - Written
                '36B0CACF-ACD1-6BC5-3E4C-3A05E77A79C9', // REx-PN Passed
                '5B4173E1-E750-9B85-9464-3A05E77D4547', // Registration Journey Complete
                'F004F837-3357-416B-918E-651BD6FAECB5', // Referral Acknowledged/Reviewed
            ]})
            .set({version:'1'})
            .execute()

    await queryRunner.connection.manager.createQueryBuilder().insert().into(IENApplicantStatus).values([
        {
            id:'764374cf-195d-4e40-92ef-6a1e7ada178b',
            status:'Signed Return of Service Agreement',
            category:StatusCategory.LICENSING_REGISTRATION,
            version:'2'

        },
        {
            id:'c29bb4d6-b3ad-4fd2-a7dc-2e7d53b35139',
            status:'BCCNM Provisional Licence RPN',
            category:StatusCategory.LICENSING_REGISTRATION,
            version:'2'
        },
        {
            id:'f9c7e2eb-437b-4ec9-b7f1-546741f243d1',
            status:'BCCNM Full Licence RPN',
            category:StatusCategory.LICENSING_REGISTRATION,
            version:'2'
        },
        {
            id:'81cb40e8-7809-4935-850a-a4092b7e3ac6',
            status:'Earn and Learn – Currently working as an LPN',
            category:StatusCategory.LICENSING_REGISTRATION,
            version:'2'
        },
        {
            id:'3b05a8ac-0685-4e68-b76f-c6b6a3b01e28',
            status:'Earn and Learn – Currently working as an HCA',
            category:StatusCategory.LICENSING_REGISTRATION,
            version:'2'
        },
        {
            id:'3d7e9415-9be8-480f-a3da-48c1e668ab00',
            status:'Learn only',
            category:StatusCategory.LICENSING_REGISTRATION,
            version:'2'
        },
        {
            id:'12dbe8da-9485-43c2-b69f-e0140aa23224',
            status:'Direct to Registration',
            category:StatusCategory.LICENSING_REGISTRATION,
            version:'2'
        },
    ]).execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('ien_applicant_status','version')
    }

}
