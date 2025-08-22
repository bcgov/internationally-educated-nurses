import calendarIcon from '@assets/img/calendar.svg';
import { ApplicantStatusAuditRO, formatDate, OutcomeGroups, STATUS } from '@ien/common';
import React, { PropsWithChildren } from 'react';
import userIcon from '@assets/img/user.svg';

type MilestoneViewProps = PropsWithChildren & {
  milestone: ApplicantStatusAuditRO;
};

export const MilestoneView = ({ milestone, children }: MilestoneViewProps) => {
  const setOutcomeGroup = (status: string) => {
    const outcomeGroup = Object.values(OutcomeGroups).find(({ milestones }) =>
      milestones.includes(status as STATUS),
    );
    return outcomeGroup?.value || null;
  };

  const getOutcomeText = (status: string) => {
    return status !== STATUS.REFERRAL_ACKNOWLEDGED ? status : '';
  };

  return (
    <div className='border border-gray-200 rounded bg-bcLightGray my-2 p-5'>
      <div className='w-full'>
        <div className='flex items-center font-bold text-black '>
          <span>{setOutcomeGroup(milestone.status.status)}</span>
          <span className='mx-2'>|</span>
          <span className='mr-2'>
            <img src={calendarIcon.src} alt='calendar' width={16} height={16} />
          </span>
          <span>{formatDate(milestone.start_date)}</span>
          {(milestone.updated_by?.email || milestone.added_by?.email) && (
            <>
              <span className='mx-2'>|</span>
              <span className='mr-2'>
                <img src={userIcon.src} alt='user' />
              </span>
              <span>Last updated by</span>
              <a
                className='ml-2'
                href={`mailto: ${milestone.updated_by?.email || milestone.added_by?.email}`}
              >
                {milestone.updated_by?.email || milestone.added_by?.email}
              </a>
            </>
          )}
          {children}
        </div>
        <div>
          {milestone.type && (
            <span className='border border-gray-200 bg-bcGreenHiredText text-white rounded text-xs px-2 py-0.5 mr-2'>
              {milestone.type}
            </span>
          )}
          <span
            className='text-sm text-bcBlueLink font-bold break-words py-1'
            style={{ fontStyle: 'italic' }}
          >
            {getOutcomeText(milestone.status.status)}
          </span>
        </div>
        <span className='text-sm text-black break-words'>
          {milestone.notes || 'No Notes Added'}
        </span>
      </div>
    </div>
  );
};
