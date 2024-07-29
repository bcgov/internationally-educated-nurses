import { ErrorMessage } from 'formik';

export interface ErrorProps {
  name: string;
}

export const Error: React.FC<ErrorProps> = ({ name }) => {
  return (
    <ErrorMessage name={name}>
      {msg => (
        <div role='alert'>
          <p className='block text-red-600 text-sm'>{msg}</p>
        </div>
      )}
    </ErrorMessage>
  );
};
