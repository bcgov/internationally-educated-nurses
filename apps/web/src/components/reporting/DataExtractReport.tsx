import dayjs from 'dayjs';
import { Formik, Form as FormikForm, FormikHelpers } from 'formik';
import { writeFileXLSX } from 'xlsx-js-style';

import { Button, Field } from '@components';
import { PeriodFilter } from '@ien/common';
import { createApplicantDataExtractWorkbook } from '@services';

const REPORT_PREFIX = 'ien-applicant-data-extract';

const initialValues: PeriodFilter = {
  from: '',
  to: '',
};

export const DataExtractReport = () => {
  const download = async (values: PeriodFilter, helpers?: FormikHelpers<PeriodFilter>) => {
    const { from, to } = values;
    const workbook = await createApplicantDataExtractWorkbook({
      from,
      to,
    });

    writeFileXLSX(workbook, `${REPORT_PREFIX}-${values.from}-${values.to}.xlsx`);

    helpers && helpers.resetForm();
  };

  const getMaxDate = () => {
    // make max date one day less than current date
    return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  };

  return (
    <>
      <div className='text-bcBluePrimary text-lg font-bold mb-4'>Data Extract</div>
      <Formik initialValues={initialValues} onSubmit={download}>
        {({ isSubmitting, handleReset, dirty, touched, values }) => (
          <FormikForm>
            <div className='flex flex-row pb-4'>
              <span className='pr-3 w-full'>
                <Field name='from' label='Start Date' type='date' max={values.to || getMaxDate()} />
              </span>
              <span className='pr-3 w-full'>
                <Field
                  name='to'
                  label='End Date'
                  type='date'
                  min={dayjs(values.from).format('YYYY-MM-DD')}
                  max={getMaxDate()}
                />
              </span>
              <span className='pr-3 mt-auto'>
                <Button
                  className='w-full px-8'
                  variant='primary'
                  disabled={isSubmitting || !dirty || !touched}
                  type='submit'
                  loading={isSubmitting}
                >
                  Download
                </Button>
              </span>
              <span className='mt-auto'>
                <Button className='w-full px-10' variant='secondary' onClick={handleReset}>
                  Clear
                </Button>
              </span>
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};
