import React from 'react';
import { SystemForm } from './system/SystemForm';
import { StatusCategory } from '@ien/common';
import { SystemMilestoneTable } from './system/SystemMilestoneTable';

type Props = {};

export const System = (props: Props) => {
  return (
    <main className='flex flex-col gap-4 py-4'>
      <section className='flex justify-end'>
        <SystemForm />
      </section>
      <section>
        <SystemMilestoneTable category={StatusCategory.SYSTEM} />
      </section>
    </main>
  );
};
