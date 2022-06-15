import { Button, Field } from '@components';
import { getApplicantDataExtract } from '@services';
import dayjs from 'dayjs';
import { Formik, Form as FormikForm } from 'formik';

const initialValues = {
  job_post_date: '',
};

// interface DataExtractReportProps {
//   periods: PeriodFilter;
// }

export const DataExtractReport = () => {
  const submit = async () => {
    const test = await getApplicantDataExtract({ from: '2022-04-28', to: '2022-05-25' });
    return test;
  };

  const getMaxDate = () => {
    return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  };

  return (
    <>
      <div className='text-bcBluePrimary text-lg font-bold mb-4'>Data Extract</div>
      <Formik initialValues={initialValues} onSubmit={submit}>
        {({ isSubmitting }) => (
          <FormikForm>
            <div className='flex flex-row pb-4'>
              <span className='pr-3 w-full'>
                <Field name='start_date' label='Start Date' type='date' max={getMaxDate()} />
              </span>
              <span className='pr-3 w-full'>
                <Field name='end_date' label='End Date' type='date' />
              </span>
              <span className='pr-3 mt-auto'>
                <Button
                  className='w-full px-8'
                  variant='primary'
                  disabled={isSubmitting}
                  type='submit'
                  loading={isSubmitting}
                >
                  Download
                </Button>
              </span>
              <span className='mt-auto'>
                <Button className='w-full px-10' variant='secondary'>
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
