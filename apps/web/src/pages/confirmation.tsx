import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ExternalLink, Notice } from '@components';

const Confirmation: React.FC = () => {
  const { push, query, isReady } = useRouter();
  const id: string = query.id as string;

  useEffect(() => {
    // redirect to the home page if the id is not present
    if (isReady && !id) {
      push('/');
    }
  });

  if (!id) return null;

  const dashedId =
    id.substring(0, 3) +
    '-' +
    id.substring(3, 6) +
    '-' +
    id.substring(6, 9) +
    '-' +
    id.substring(9);
  return (
    <div className='md:pt-40 pt-12 px-5 md:px-4'>
      <div className='max-w-xl text-center'>
        <div className='text-3xl md:text-4xl px-5 md:px-2 text-bcBluePrimary mb-5 '>
          Thank You For Filling Out The Form
        </div>
        <Notice>
          <p className='leading-8'>
            Your EHPR registration ID: <b>{dashedId || id}</b>
          </p>
        </Notice>
        <section className='px-5 mb-5'>
          <p className='mb-2'>
            You will receive an email confirmation shortly at the email address provided on the form
          </p>
          <p>
            For any further inquiries, please contact&nbsp;
            <ExternalLink href='mailto:EHPRQuestions@gov.bc.ca'>
              EHPRQuestions@gov.bc.ca
            </ExternalLink>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Confirmation;
