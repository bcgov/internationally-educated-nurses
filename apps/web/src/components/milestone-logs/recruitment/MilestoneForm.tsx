import { useEffect, useState } from 'react';
import { FieldProps, Formik, Form as FormikForm, FormikHelpers, FormikProps } from 'formik';
import createValidator from 'class-validator-formik';
import ReactSelect from 'react-select';
import dayjs from 'dayjs';
import {
  ApplicantJobRO,
  ApplicantStatusAuditRO,
  IenTypes,
  IENApplicantAddStatusDTO,
  IENApplicantUpdateStatusDTO,
  IENStatusReasonRO,
  OutcomeGroup,
  OutcomeGroups,
  STATUS,
} from '@ien/common';
import {
  MilestoneType,
  StyleOption,
  useGetMilestoneOptions,
  useGetWithdrawReasonOptions,
} from '@services';
import {
  BasicSelect,
  Button,
  buttonBase,
  Field,
  getSelectStyleOverride,
  HorizontalLine,
  Input,
  Radio,
  Textarea,
} from '@components';
import addIcon from '@assets/img/add.svg';
import { DatePickerField } from '../../form/DatePickerField';

type ReasonOption = StyleOption & IENStatusReasonRO;

type MilestoneFormValues = IENApplicantAddStatusDTO | IENApplicantUpdateStatusDTO;

export const getInitialMilestoneFormValues = <T extends MilestoneFormValues>(
  milestones?: MilestoneType[],
  status?: ApplicantStatusAuditRO,
): T =>
({
  status: milestones?.find(m => m.id === status?.status?.id)?.status,
  start_date: `${status?.start_date || ''}`,
  notes: `${status?.notes || ''}`,
  reason: `${status?.reason?.id || ''}`,
  effective_date: `${status?.effective_date || ''}`,
  type: status?.type,
} as T);

interface MilestoneFormProps<T extends MilestoneFormValues> {
  job?: ApplicantJobRO;
  milestone?: ApplicantStatusAuditRO;
  handleSubmit: (values: T, { resetForm }: FormikHelpers<T>) => Promise<void>;
  onClose?: () => void;
  category: string;
}

export const MilestoneForm = <T extends MilestoneFormValues>(props: MilestoneFormProps<T>) => {
  const { job, milestone, handleSubmit, onClose, category } = props;

  const milestones = useGetMilestoneOptions(category);
  const reasons = useGetWithdrawReasonOptions();

  const [outcomeGroup, setOutcomeGroup] = useState<OutcomeGroup | null>(null);
  const [outcomeOptions, setOutcomeOptions] = useState<MilestoneType[]>([]);
  const [outcome, setOutcome] = useState<MilestoneType | undefined>(
    milestones?.find(m => m.id === milestone?.status?.id),
  );

  const milestoneValidator = createValidator(IENApplicantAddStatusDTO);

  const submit = async (values: T, helpers: FormikHelpers<T>) => {
    if (values.status !== STATUS.JOB_OFFER_ACCEPTED) {
      values.effective_date = undefined;
    }

    setOutcomeGroup(null);
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

  const handleOutcomeType = (group: string, { setFieldValue, setFieldTouched }: FormikProps<T>) => {
    const outcomeGroup = Object.values(OutcomeGroups).find(({ value }) => value === group);
    
    if (outcomeGroup?.value === `${STATUS.REFERRAL_ACKNOWLEDGED}`) {
      const milestoneId = milestones.find(s => s.status == outcomeGroup?.value);

      setFieldValue('status', milestoneId?.status);
    } else {
      setFieldValue('status', '');
    }
    setFieldTouched('status', false);
    setFieldValue('reason', '');
    setFieldTouched('reason', false);
    setOutcome(undefined);
    setOutcomeGroup(outcomeGroup || null);
  };

  useEffect(
    function initOutcomeGroup() {
      if (milestone) {
        setOutcomeGroup(
          OutcomeGroups.find(group =>
            group.milestones.includes(milestone.status.status as STATUS),
          ) || null,
        );
      }
    },
    [milestone],
  );

  useEffect(
    function updateAvailableOutcomeOptions() {
      if (!outcomeGroup) {
        setOutcomeOptions([]);
        return;
      }
      const options = milestones.filter(option =>
        outcomeGroup.milestones.includes(option.status as STATUS),
      );
      setOutcomeOptions(options);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [outcomeGroup],
  );

  return (
    <div className='border border-gray-200 rounded bg-gray-200 my-3 px-3 pb-4'>
      <div className='w-full pt-4'>
        <Formik<T>
          initialValues={getInitialMilestoneFormValues<T>(milestones, milestone)}
          onSubmit={submit}
          validate={milestoneValidator}
        >
          {props => (
            <FormikForm>
              <div className='grid grid-cols-12 gap-y-2 mb-2 content-end'>
                <div className='col-span-12 sm:col-span-6'>
                  <BasicSelect<string>
                    id='outcomeType'
                    label='Milestone'
                    onChange={val => {
                      handleOutcomeType(val, props);
                    }}
                    options={OutcomeGroups}
                    value={outcomeGroup?.value || ''}
                    underline
                    textAlign='left'
                    optionStyle={{ padding: '10px 20px' }}
                  />
                </div>
                <div className='col-span-6 pr-1 ml-3'>
                  <div className='mb-4'>
                    <Field
                      name='status'
                      label='Outcome'
                      component={({ field, form }: FieldProps) => (
                        <ReactSelect<MilestoneType>
                          inputId={field.name}
                          value={
                            outcomeGroup?.value === `${STATUS.REFERRAL_ACKNOWLEDGED}`
                              ? undefined
                              : outcomeOptions?.find(s => s.status == field.value)
                          }
                          onBlur={field.onBlur}
                          onChange={value => {
                            form.setFieldValue(field.name, `${value?.status}`);
                            setOutcome(milestones.find(m => m.id === value?.id));
                            if (outcome?.status !== `${STATUS.WITHDREW_FROM_COMPETITION}`) {
                              form.setFieldValue('reason', '');
                            }
                          }}
                          options={outcomeOptions?.map(s => ({
                            ...s,
                            isDisabled: s.status == field.value,
                          }))}
                          getOptionLabel={option => option.status}
                          styles={getSelectStyleOverride<MilestoneType>('bg-white')}
                          isDisabled={outcomeGroup?.value === `${STATUS.REFERRAL_ACKNOWLEDGED}`}
                        />
                      )}
                    />
                  </div>
                  {outcome?.status === `${STATUS.WITHDREW_FROM_COMPETITION}` && (
                    <div>
                      <Field
                        name='reason'
                        label='Outcome Reason'
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
                            components={{ Input }}
                          />
                        )}
                      />
                      <div className='hidden'>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-2 md:pr-2 mt-auto'>
                          {/* hiding add new reason button until implemented, kept in dom for layout purposes */}
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
                    </div>
                  )}
                </div>
              </div>
              {outcome?.status === STATUS.JOB_OFFER_ACCEPTED && (
                <div>
                  <Radio
                    name='type'
                    legend='Type'
                    options={IenTypes.map(t => ({ value: t, label: t }))}
                    horizontal
                  />
                </div>
              )}
              {outcome?.status === `${STATUS.WITHDREW_FROM_COMPETITION}` && (
                <div className='py-4'>
                  <HorizontalLine />
                </div>
              )}
              <div className='grid grid-cols-12 gap-y-2 mb-4'>
                <div className='col-span-6'>
                  <DatePickerField
                    name='start_date'
                    label='Date'
                    format='yyyy-MM-dd'
                    bgColour='bg-white'
                    max={new Date()}
                    validate={(val: string) => validateStartDate(val)}
                  />
                </div>
                {/* Candidate accepted job offer conditional */}
                {outcome?.status === `${STATUS.JOB_OFFER_ACCEPTED}` && (
                  <div className='col-span-6 ml-3'>
                    <DatePickerField
                      name='effective_date'
                      label='Target Start Date'
                      format='yyyy-MM-dd'
                      bgColour='bg-white'
                    />
                  </div>
                )}
                <div className='col-span-12 mt-4'>
                  <Textarea name='notes' label='Notes' placeholder='Type note here...' />
                </div>
              </div>
              <div className='mt-12'>
                <Button
                  variant={milestone ? 'primary' : 'outline'}
                  disabled={props.isSubmitting}
                  type='submit'
                  loading={props.isSubmitting}
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
              </div>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
};
