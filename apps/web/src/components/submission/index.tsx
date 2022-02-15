import { FormikHelpers, Formik, FormikProps, Form as FormikForm } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { Button } from '@components';
import { submitForm } from '@services';
import { Contact, Credential, Preferences, Personal, Review } from './components';
import {
  personalSchema,
  contactSchema,
  SubmissionType,
  initialSubmissionValues,
  DeepPartial,
  credentialSchema,
  preferencesSchema,
  reviewSchema,
  prefilledSubmissionValues,
} from './validation';
import { Ret } from 'class-validator-formik/dist/convertError';

interface StepType {
  component: React.ReactElement;
  validationSchema: (data: unknown) => Ret;
  key?: keyof SubmissionType;
}

enum FormKeys {
  PERSONAL_INFORMATION = 'personalInformation',
  CONTACT_INFORMATION = 'contactInformation',
  CREDENTIAL_INFORMATION = 'credentialInformation',
  PREFERENCES_INFORMATION = 'preferencesInformation',
}

const steps: StepType[] = [
  {
    component: <Personal formKey={FormKeys.PERSONAL_INFORMATION} />,
    validationSchema: personalSchema,
    key: FormKeys.PERSONAL_INFORMATION,
  },
  {
    component: <Contact formKey={FormKeys.CONTACT_INFORMATION} />,
    validationSchema: contactSchema,
    key: FormKeys.CONTACT_INFORMATION,
  },
  {
    component: <Credential />,
    validationSchema: credentialSchema,
    key: FormKeys.CREDENTIAL_INFORMATION,
  },
  {
    component: <Preferences formKey={FormKeys.PREFERENCES_INFORMATION} />,
    validationSchema: preferencesSchema,
    key: FormKeys.PREFERENCES_INFORMATION,
  },
  {
    component: <Review />,
    validationSchema: reviewSchema,
  },
];

const handleValidate = (
  validator: (data: unknown) => Ret,
  values?: DeepPartial<SubmissionType>,
  key?: keyof DeepPartial<SubmissionType>,
) => {
  if (!key) return validator(values);
  if (!values) return {};

  const errors = validator(values[key]);

  if (Object.keys(errors).length === 0) {
    return errors;
  }

  return {
    [key]: errors,
  };
};

// @todo remove DeepPartial when all form steps are implemented
export const Form: React.FC = () => {
  const formikRef = useRef<FormikProps<DeepPartial<SubmissionType>>>(null);
  const router = useRouter();

  const step = Number(router.query.step);
  const stepIndex = step - 1;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const previousStepValidation = steps[stepIndex - 1]?.validationSchema;
  const currentStepValidation = steps[stepIndex]?.validationSchema;
  const currentStepComponent = steps[stepIndex]?.component;
  const previousStepKey = steps[stepIndex - 1]?.key;
  const currentStepKey = steps[stepIndex]?.key;

  const handleSubmit = async (
    values: DeepPartial<SubmissionType>,
    helpers: FormikHelpers<DeepPartial<SubmissionType>>,
  ) => {
    if (isLastStep) {
      const { data } = await submitForm(values);
      router.push({
        pathname: '/confirmation',
        query: { id: data.data.confirmationId },
      });
    } else {
      helpers.setTouched({});
      router.push(`/submission/${step + 1}`);
    }
    helpers.setSubmitting(false);
  };

  const goToPreviousStep = () => {
    router.push(`/submission/${Number(step) - 1}`);
  };

  /**
   * This effect handles routing and preventing access to steps in the
   * form when the previous step hasn't been completed.
   */
  useEffect(() => {
    if (!router.query.step) return;

    if (step === 1) {
      // no redirect needed on first step
      return;
    }

    const checkPreviousStep = async () => {
      const errors = handleValidate(
        previousStepValidation,
        formikRef.current?.values,
        previousStepKey,
      );
      if (Object.keys(errors).length > 0) {
        router.replace('/submission/1');
      }
    };
    checkPreviousStep();
  }, [step, router, previousStepValidation, previousStepKey]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={
        process.env.NEXT_PUBLIC_PREFILLED_FORM ? prefilledSubmissionValues : initialSubmissionValues
      }
      validate={values => handleValidate(currentStepValidation, values, currentStepKey)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <FormikForm>
          <div className='flex flex-col items-center'>
            <div className='w-full md:w-1/2 px-6 md:px-0  mb-12'>{currentStepComponent}</div>

            <div className='flex justify-between w-10/12 md:w-1/2 mb-14'>
              <Button
                variant='secondary'
                disabled={isFirstStep}
                onClick={goToPreviousStep}
                type='button'
              >
                Back
              </Button>
              <Button
                variant='primary'
                disabled={isSubmitting}
                loading={isSubmitting}
                type='submit'
              >
                {isLastStep ? 'Submit' : 'Next'}
              </Button>
            </div>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};
