import { Access } from '@ien/common';
import withAuth from 'src/components/Keycloak';
import { ApplicantProvider } from '../components/applicant/ApplicantContext';
import { ApplicantProfile } from '../components/applicant/ApplicantProfile';
import { ApplicantMilestones } from '../components/applicant/ApplicantMilestones';
import { DetailsNavBar } from '../components/DetailsNavBar';

const Details = () => {
  return (
    <ApplicantProvider>
      <div className='container w-full  xl:w-xl mb-4'>
        <DetailsNavBar parent='Manage Applicants' label='Applicant Details' />
        <ApplicantProfile />
        <ApplicantMilestones />
      </div>
    </ApplicantProvider>
  );
};

export default withAuth(Details, [Access.APPLICANT_READ, Access.APPLICANT_WRITE]);
