import React, { useState } from 'react';
import { ApplicantRO, Authorities } from '@ien/common';
import { useAuthContext } from '../AuthContexts';
import { useApplicantContext } from './ApplicantContext';
import { Button } from '@components';

interface AssignedToProps {
  applicant: ApplicantRO;
}

export const RecruiterAssignment = ({ applicant }: AssignedToProps) => {
  const [showButton, setShowButton] = useState(false);

  const { authUser } = useAuthContext();
  const { assignToMe } = useApplicantContext();

  const assignedTo = applicant.recruiters?.find(e => {
    return e.organization === authUser?.organization;
  });

  return (
    <div
      className='mt-2'
      onMouseOver={() => setShowButton(true)}
      onMouseOut={() => setShowButton(false)}
    >
      {!assignedTo || (showButton && assignedTo.id !== authUser?.id) ? (
        <Button variant='outline' onClick={assignToMe}>
          Assign to me
        </Button>
      ) : (
        <>
          <span className='border border-gray-200 bg-bcBlueAccent text-white rounded text-xs px-2 py-0.5 mr-1'>
            {Object.keys(Authorities).find(
              abbr => Authorities[abbr].name === assignedTo.organization,
            )}
          </span>
          <span className='m-2 ml-2' data-cy='recruiter'>
            {assignedTo?.name}
          </span>
        </>
      )}
    </div>
  );
};
