// import { Field, FieldProps } from '@components';

// export interface OptionType {
//   label: string;
//   value: string;
//   disabled?: boolean;
// }

// export const Select: React.FC<FieldProps> = props => {
//   const { name, label, disabled, description, children } = props;

//   return (
//     <Field name={name} label={label} description={description} disabled={disabled} as='select'>
//       <option value={''} key={''} className='hidden'></option>
//       {children}
//     </Field>
//   );
// };

// export const Option: React.FC<OptionType> = ({ label, value, disabled }) => {
//   return (
//     <option value={value} key={value} disabled={disabled} hidden={disabled}>
//       {label}
//     </option>
//   );
// };
import { Field as FormikField, useField } from 'formik';

interface OptionType {
  label: string;
  value: string;
}

interface SelectProps {
  name: string;
  label: string;
  options: OptionType[];
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ name, options, label, disabled }) => {
  const [, meta] = useField(name);

  return (
    <div>
      <label htmlFor={name} className='formLabel'>
        {label}
      </label>
      <FormikField className={`formField `} id={name} as='select' name={name} disabled={disabled}>
        <option value={''} key={''} className='hidden'></option>
        {options.map(option => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </FormikField>
      {meta.touched && meta.error && <p className='formError'>{meta.error}</p>}
    </div>
  );
};
