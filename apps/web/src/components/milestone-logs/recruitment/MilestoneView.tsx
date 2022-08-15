import calendarIcon from '@assets/img/calendar.svg';
import { ApplicantStatusAuditRO, formatDate } from '@ien/common';
import React, { PropsWithChildren, ReactNode } from 'react';
import userIcon from '@assets/img/user.svg';

type MilestoneViewProps = PropsWithChildren<ReactNode> & {
  milestone: ApplicantStatusAuditRO;
};

export const MilestoneView = ({ milestone, children }: MilestoneViewProps) => {
  return (
    <div className='border border-gray-200 rounded bg-bcLightGray my-2 p-5'>
      <div className='w-full'>
        <div className='flex items-center font-bold text-black '>
          <span className='capitalize'>{milestone.status.status}</span>
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
        <span className='text-sm text-black break-words'>
          {milestone.notes || 'No Notes Added'}
        </span>
      </div>
    </div>
  );
};