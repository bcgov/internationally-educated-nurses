import React from 'react';
import { FieldProps, Formik, Form as FormikForm, FormikHelpers } from 'formik';
import createValidator from 'class-validator-formik';
import ReactSelect from 'react-select';
import dayjs from 'dayjs';
import {
  MilestoneType,
  StyleOption,
  useGetMilestoneOptions,
  useGetWithdrawReasonOptions,
} from '@services';
import {
  ApplicantJobRO,
  ApplicantStatusAuditRO,
  IENApplicantAddStatusDTO,
  IENApplicantUpdateStatusDTO,
  IENStatusReasonRO,
  STATUS,
} from '@ien/common';
import { Button, buttonBase, Field, getSelectStyleOverride, Textarea } from '@components';
import addIcon from '@assets/img/add.svg';
import { DatePickerField } from '../../form/DatePickerField';

type ReasonOption = StyleOption & IENStatusReasonRO;

type MilestoneFormValues = IENApplicantAddStatusDTO | IENApplicantUpdateStatusDTO;

export const getInitialMilestoneFormValues = <T extends MilestoneFormValues>(
  status?: ApplicantStatusAuditRO,
): T =>
  ({
    status: `${status?.status?.id || ''}`,
    start_date: `${status?.start_date || ''}`,
    notes: `${status?.notes || ''}`,
    reason: `${status?.reason?.id || ''}`,
    effective_date: `${status?.effective_date || ''}`,
  } as T);

interface MilestoneFormProps<T extends MilestoneFormValues> {
  job?: ApplicantJobRO;
  milestone?: ApplicantStatusAuditRO;
  handleSubmit: (values: T, { resetForm }: FormikHelpers<T>) => Promise<void>;
  onClose?: () => void;
  milestoneTabId: string;
}

export const MilestoneForm = <T extends MilestoneFormValues>(props: MilestoneFormProps<T>) => {
  const { job, milestone, handleSubmit, onClose, milestoneTabId } = props;
  console.log(milestoneTabId);
  const milestones = useGetMilestoneOptions(milestoneTabId);
  console.log(milestones);
  const reasons = useGetWithdrawReasonOptions();

  const milestoneValidator = createValidator(IENApplicantAddStatusDTO);

  const submit = async (values: T, helpers: FormikHelpers<T>) => {
    if (values.status !== `${STATUS.Candidate_accepted_the_job_offer}`) {
      values.effective_date = undefined;
    }

    await handleSubmit(values, helpers);
    if (onClose) onClose();
  };

  const validateStartDate = (value: string) => {
    if (!job) {
      return;
    }
    if (dayjs(value).diff(job.job_post_date) < 0) {
      return 'Date must be later than the date job was first posted';
    }
    if (dayjs().diff(value) < 0) {
      return 'Date must be a past date';
    }
  };

  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik<T>
          initialValues={getInitialMilestoneFormValues<T>(milestone)}
          onSubmit={submit}
          validate={milestoneValidator}
        >
          {({ isSubmitting, values }) => (
            <FormikForm>
              <div className='grid grid-cols-12 gap-y-2 mb-4'>
                <span className='col-span-12 sm:col-span-6 pr-1 md:pr-2'>
                  <div>
                    <Field
                      name='status'
                      label='Milestone'
                      component={({ field, form }: FieldProps) => (
                        <ReactSelect<MilestoneType>
                          inputId={field.name}
                          value={milestones?.find(s => s.id == field.value)}
                          onBlur={field.onBlur}
                          onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                          options={milestones?.map(s => ({
                            ...s,
                            isDisabled: s.id == field.value,
                          }))}
                          getOptionLabel={option => option.status}
                          styles={getSelectStyleOverride<MilestoneType>('bg-white')}
                        />
                      )}
                    />
                  </div>

                  <div className='pt-4'>
                    <DatePickerField
                      name='start_date'
                      label='Date'
                      format='yyyy-MM-dd'
                      bgColour='bg-white'
                      max={new Date()}
                      validate={(val: string) => validateStartDate(val)}
                    />
                  </div>
                </span>

                <span className='col-span-12 sm:col-span-6  pr-1 md:pr-2 ml-3'>
                  <Textarea name='notes' label='Notes' />
                </span>
                {/* Withdraw reason conditional field */}
                {values.status === `${STATUS.Candidate_withdrew}` ? (
                  <>
                    <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                      <Field
                        name='reason'
                        label='Withdraw Reason'
                        component={({ field, form }: FieldProps) => (
                          <ReactSelect<ReasonOption>
                            inputId={field.name}
                            value={reasons?.find(opt => opt.id == field.value)}
                            onBlur={field.onBlur}
                            onChange={value => form.setFieldValue(field.name, `${value?.id}`)}
                            options={reasons?.map(opt => ({
                              ...opt,
                              isDisabled: opt.id == field.value,
                            }))}
                            getOptionLabel={opt => `${opt.name}`}
                            getOptionValue={opt => `${opt.id}`}
                            styles={getSelectStyleOverride<ReasonOption>('bg-white')}
                          />
                        )}
                      />
                    </span>
                    <div className='col-span-12 sm:col-span-6 lg:col-span-2 md:pr-2 mt-auto'>
                      {/* hiding add new reason button until implemented, kept in dom for layout purposes */}
                      <div className='invisible'>
                        <button
                          className={`border border-bcGray rounded text-bcGray ${buttonBase} pointer-events-none`}
                        >
                          <span className='whitespace-nowrap px-1 text-bcGray text-xs'>
                            Add New Reason
                          </span>
                          <img src={addIcon.src} alt='add reason' />
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Candidate accepted job offer conditional */}
                {values.status === `${STATUS.Candidate_accepted_the_job_offer}` ? (
                  <span className='col-span-12 sm:col-span-6 lg:col-span-3 pr-1 md:pr-2'>
                    <DatePickerField
                      name='effective_date'
                      label='Target Start Date'
                      format='yyyy-MM-dd'
                      bgColour='bg-white'
                    />
                  </span>
                ) : null}
              </div>
              <Button
                className='px-3'
                variant={milestone ? 'primary' : 'outline'}
                disabled={isSubmitting}
                type='submit'
                loading={isSubmitting}
              >
                {milestone ? 'Save Changes' : 'Save Milestone'}
              </Button>
              {milestone && (
                <Button
                  className='ml-2 px-7 border-2 border-bcBluePrimary'
                  variant='outline'
                  onClick={onClose}
                >
                  Cancel
                </Button>
              )}
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
