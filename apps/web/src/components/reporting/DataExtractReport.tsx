import dayjs from 'dayjs';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import { writeFileXLSX } from 'xlsx-js-style';
import createValidator from 'class-validator-formik';

import { Button } from '@components';
import { PeriodFilter, ReportPeriodDTO } from '@ien/common';
import { createApplicantDataExtractWorkbook } from '@services';
import { DatePickerField } from '../form/DatePickerField';
import React from 'react';

const REPORT_PREFIX = 'ien-applicant-data-extract';
const MIN_DATE = 'January 1, 2001';

const initialValues: PeriodFilter = {
  from: '',
  to: '',
};

export const DataExtractReport = () => {
  const dataExtractSchema = createValidator(ReportPeriodDTO);

  const download = async (values: PeriodFilter, helpers?: FormikHelpers<PeriodFilter>) => {
    const { from, to } = values;
    const workbook = await createApplicantDataExtractWorkbook({
      from,
      to,
    });

    if (workbook) {
      writeFileXLSX(workbook, `${REPORT_PREFIX}-${values.from}-${values.to}.xlsx`);
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
              <span className='pr-3 w-full'>
                <DatePickerField
                  name='to'
                  label='End Date'
                  format='yyyy-MM-dd'
                  min={dayjs(values.from || MIN_DATE).toDate()}
                  max={dayjs(getMaxDate()).toDate()}
                  validate={(val: string) => validateDate(val)}
                />
              </span>
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
