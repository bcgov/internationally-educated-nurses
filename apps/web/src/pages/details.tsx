import { ValidRoles } from '@ien/common';
import withAuth from 'src/components/Keycloak';
import { ApplicantProvider } from '../applicant/ApplicantContext';
import { ApplicantProfile } from '../applicant/ApplicantProfile';
import { ApplicantMilestones } from '../applicant/ApplicantMilestones';

const Details = () => {
  return (
    <ApplicantProvider>
      <div className='container w-full mx-6 xl:w-xl mb-4 px-4'>
        <ApplicantProfile />
        <ApplicantMilestones />
      </div>
    </ApplicantProvider>
  );
};

export default withAuth(Details, [
  ValidRoles.MINISTRY_OF_HEALTH,
  ValidRoles.HEALTH_MATCH,
  ValidRoles.HEALTH_AUTHORITY,
  ValidRoles.ROLEADMIN,
]);
