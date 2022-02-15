import { useRouter } from 'next/router';

import { ExternalLink, Form, Stepper } from '@components';
import { useEffect, useRef } from 'react';

const FORM_STEPS = ['Primary', 'Contact', 'Credentials', 'Preferences', 'Review and Submit'];

const Submission = () => {
  const router = useRouter();

  const step = Number(router.query.step);

  // do not scroll to the top of the form on initial load
  const formRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef<number>(1);
  useEffect(() => {
    if (!isNaN(step) && prevStepRef.current !== step && formRef.current) {
      window.scrollTo(0, formRef.current.offsetTop);
      prevStepRef.current = step;
    }
  }, [step]);

  return (
    <>
      <div className='flex-grow bg-bcLightBackground flex justify-center md:pt-11 pt-5'>
        <div className='h-min md:w-layout w-full md:mx-0 mx-2 mb-12'>
          <h1 className='text-3xl mb-7 mx-6 lg:text-4xl lg:mb-3 lg:mx-0'>
            Health Provider Registry for BC’s Emergency Response
          </h1>
          <section className='mb-7'>
            <p className='mb-4'>
              The <b>Emergency Health Provider Registry (EHPR)</b> is an online registry to support
              the proactive deployment of health care providers to ensure BC’s health care system is
              best prepared to respond to emergencies (e.g., wildfires, floods, pandemics). It is an
              online registry of health care professionals and health authority staff who are able
              and willing to be deployed or hired to support B.C.’s health system response. For more
              information about the EHPR, please refer to the&nbsp;
              <ExternalLink href='https://www.heu.org/sites/default/files/2021-08/FAQ%20EHPR_12August2020.pdf'>
                FAQs
              </ExternalLink>
              .
            </p>
            <p className='mb-4'>
              All&nbsp;
              <ExternalLink href='https://www.heu.org/sites/default/files/2021-08/FAQ%20EHPR_12August2020.pdf'>
                eligible health care providers or health care staff
              </ExternalLink>
              &nbsp;are invited to register using the form below. Health authorities, the Ministry
              of Health or HealthMatch BC may use the EHPR to initiate contact if/when assistance is
              required.
            </p>
            <p className='mb-4'>
              The form takes about 10 minutes to complete - if you are in a career stream with
              oversight from a regulatory or credentialing body (e.g., BC College of Nursing
              Professionals), please have your registration number available.
            </p>
            <p className='mb-4'>
              <b>If you encounter problems completing this form, please email </b>
              <ExternalLink href='mailto:EHPRQuestions@gov.bc.ca'>
                EHPRQuestions@gov.bc.ca
              </ExternalLink>
              .
            </p>
            <p className='mb-4'>
              Your personal information is being collected in compliance with BC privacy legislation
              under sections 26(c) and (e) of the{' '}
              <i>Freedom of Information and Protection of Privacy Act.</i> Your information will be
              retained for five years and be shared with the Ministry of Health, Health Match BC and
              health authorities, to support B.C.’s health emergency response.
            </p>

            <p className='font-bold'>
              If you have any questions about our collection or use of personal information, please
              email your inquiries to&nbsp;
              <ExternalLink href='mailto:EHPRQuestions@gov.bc.ca'>
                EHPRQuestions@gov.bc.ca
              </ExternalLink>
              .
            </p>
          </section>

          <div className='bg-white rounded' ref={formRef}>
            <div className='p-4 border-b mb-5'>
              <Stepper formSteps={FORM_STEPS} step={step} />
            </div>

            <Form />
          </div>
        </div>
      </div>
    </>
  );
};

export default Submission;
