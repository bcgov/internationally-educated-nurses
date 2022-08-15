import React from 'react';
import { FieldProps as FormikFieldProps } from 'formik';
import ReactSelect from 'react-select';
import { Field, FieldProps, getSelectStyleOverride, OptionType } from '@components';

interface MultiSelectProps extends FieldProps {
  options: OptionType[];
}

/**
 * Description is not enabled for this component, it's not required by designs and
 * aria-describedby is not supported by react-select
 */
export const MultiSelect: React.FC<MultiSelectProps> = props => {
  const { label, name, options, disabled } = props;

  return (
    <Field
      name={name}
      label={label}
      component={({ field, form }: FormikFieldProps) => (
        <ReactSelect<OptionType, true>
          inputId={name}
          options={options}
          value={field.value}
          onChange={value =>
            form.setFieldValue(
              name,
              value.map(val => ({ id: val.value, ...val })), // also set the name field to match DTOs
            )
          }
          onBlur={field.onBlur}
          isDisabled={disabled}
          styles={getSelectStyleOverride<OptionType>()}
          isMulti
        />
      )}
    />
  );
};
