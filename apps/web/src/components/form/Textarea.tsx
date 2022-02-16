import { useFormikContext } from 'formik';

import { Field, FieldProps } from '@components';

interface TextareaProps extends FieldProps {
  maxLength?: number;
  rows?: number;
}

export const Textarea: React.FC<TextareaProps> = ({ name, label, description, maxLength }) => {
  const { values } = useFormikContext<Record<string, string>>();

  return (
    <div>
      <Field
        name={name}
        label={label}
        description={description}
        maxLength={maxLength}
        as='textarea'
        className='bg-white h-20 w-full border rounded border-bcBlack p-1.5'
      />
      {maxLength ? (
        <>
          <p aria-hidden className='text-right relative -top-12 -left-4 h-0'>
            {values[name]?.length}/{maxLength} <span className='sr-only'>characters remaining</span>
          </p>
          <p className='sr-only' role='alert'>
            {values[name]?.length === maxLength
              ? `Text area character limit reached. You can only use ${maxLength} characters in this field.`
              : ''}
          </p>
        </>
      ) : null}
    </div>
  );
};
