import React from 'react';
import { SystemForm } from './system/SystemForm';
import { Access, StatusCategory } from '@ien/common';
import { SystemMilestoneTable } from './system/SystemMilestoneTable';
import { AclMask } from '../user';

export const System = () => {
  return (
    <main className='flex flex-col gap-4 py-4'>
      <section className='flex justify-end'>
        <AclMask acl={[Access.READ_SYSTEM_MILESTONE, Access.WRITE_SYSTEM_MILESTONE]}>
          <SystemForm />
        </AclMask>
      </section>
      <section>
        <AclMask acl={[Access.READ_SYSTEM_MILESTONE]}>
          <SystemMilestoneTable category={StatusCategory.SYSTEM} />
        </AclMask>
      </section>
    </main>
  );
};
