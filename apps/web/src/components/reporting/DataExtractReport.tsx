import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import { WorkBook, writeFileXLSX } from 'xlsx-js-style';
import { createValidator } from 'src/utils/dto-validator';
import ReactSelect from 'react-select';

import { Button, getSelectStyleOverride, Label } from '@components';
import { Authorities, PeriodFilter, ReportPeriodDTO } from '@ien/common';
import {
  createApplicantDataExtractWorkbook,
  createMilestoneDataExtractWorkbook,
  SelectOption,
} from '@services';
import { useAuthContext } from '../AuthContexts';
import { DatePickerField } from '../form/DatePickerField';

const MIN_DATE = 'January 1, 2001';

const DataTypeOptions: SelectOption<string>[] = [
  { value: 'applicants', label: 'Applicants' },
  { value: 'milestones', label: 'Milestones' },
];

const initialValues: PeriodFilter = {
  from: '',
  to: '',
};

export const DataExtractReport = () => {
  const { authUser } = useAuthContext();

  const [dataType, setDataType] = useState(DataTypeOptions[0].value);

  const dataExtractSchema = createValidator(ReportPeriodDTO);

  const download = async (values: PeriodFilter, helpers?: FormikHelpers<PeriodFilter>) => {
    let workbook: WorkBook | null;

    if (dataType === 'applicants') {
      workbook = await createApplicantDataExtractWorkbook(values);
    } else {
      workbook = await createMilestoneDataExtractWorkbook(values);
    }

    if (workbook) {
      const prefix = `ien-${dataType}-data-extract`;
      const period = `${values.from}-${values.to}`;
      writeFileXLSX(workbook, `${prefix}_${period}.xlsx`);
    }

    helpers && helpers.resetForm();
  };

  const getMaxDate = () => {
    // make max date one day less than current date
    return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  };

  const validateDate = (value: string, end?: string) => {
    if (dayjs(value).diff(end) > 0) {
      return 'Start Date must be before or equal to the End Date';
    }
    if (dayjs(end).diff(value) < 0) {
      return 'End Date must be after or equal to the Start Date';
    }
    if (dayjs(value).diff(getMaxDate()) > 0) {
      return 'Date must be before current date';
    }
    if (dayjs(value).diff(MIN_DATE) < 0) {
      return `Date must be after ${MIN_DATE}`;
    }
  };

  useEffect(
    function initializeDataOption() {
      if (authUser && authUser.organization === Authorities.MOH.name) {
        setDataType(DataTypeOptions[1].value);
      }
    },
    [authUser],
  );

  return (
    <div className='h-32'>
      <div className='text-bcBluePrimary text-lg font-bold mb-4'>Data Extract</div>
      <Formik initialValues={initialValues} onSubmit={download} validate={dataExtractSchema}>
        {({ isSubmitting, handleReset, isValid, dirty, touched, values }) => (
          <FormikForm>
            <div className='flex flex-row pb-6'>
              <span className='pr-3 w-full'>
                <DatePickerField
                  name='from'
                  label='Start Date'
                  format='yyyy-MM-dd'
                  min={dayjs(MIN_DATE).toDate()}
                  max={dayjs(values.to || getMaxDate()).toDate()}
                  validate={(val: string) => validateDate(val, values.to)}
                />
              </span>
              <span className='w-full'>
                <DatePickerField
                  name='to'
                  label='End Date'
                  format='yyyy-MM-dd'
                  min={dayjs(values.from || MIN_DATE).toDate()}
                  max={dayjs(getMaxDate()).toDate()}
                  validate={(val: string) => validateDate(val)}
                />
              </span>
              <div className='mx-8 w-2/5'>
                <div className='mb-2'>
                  <Label htmlFor='data-extract-type'>Data Type</Label>
                </div>
                <ReactSelect<SelectOption<string>>
                  id='data-extract-type'
                  options={DataTypeOptions}
                  onChange={v => setDataType(v?.value ?? '')}
                  value={DataTypeOptions.find(v => v.value === dataType)}
                  styles={getSelectStyleOverride()}
                  className='placeholder-bcGray'
                />
              </div>
              <span className='pr-3 mt-8'>
                <Button
                  className='w-full px-8'
                  variant='primary'
                  disabled={isSubmitting || !dirty || !touched || !isValid}
                  type='submit'
                  loading={isSubmitting}
                >
                  Download
                </Button>
              </span>
              <span className='mt-8'>
                <Button className='w-full px-10' variant='secondary' onClick={handleReset}>
                  Clear
                </Button>
              </span>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};
