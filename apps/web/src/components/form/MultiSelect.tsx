import React from 'react';
import { FieldProps as FormikFieldProps } from 'formik';
import ReactSelect, { StylesConfig } from 'react-select';
import { Field, FieldProps, OptionType } from '@components';

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
        <ReactSelect
          inputId={name}
          options={options}
          value={field.value}
          onChange={value =>
            form.setFieldValue(
              name,
              value.map(value => ({ id: value.value, ...value })), // also set the name field to match DTOs
            )
          }
          onBlur={field.onBlur}
          isDisabled={disabled}
          styles={selectStyleOverride}
          isMulti
        />
      )}
    />
  );
};

export const selectStyleOverride: StylesConfig<OptionType, true> = {
  indicatorSeparator: styles => ({ ...styles }),
  clearIndicator: styles => ({ ...styles, color: 'black' }),
  indicatorsContainer: styles => ({ ...styles, color: 'black' }),
  dropdownIndicator: styles => ({
    ...styles,
    paddingRight: '0',
    color: 'black',
    transform: 'scale(0.8, 0.85)',
  }),
  input: styles => ({ ...styles }),
  control: (styles, { isDisabled }) => ({
    ...styles,
    display: 'flex',
    padding: '1px',
    border: '0',
    borderBottom: isDisabled ? '2px solid rgb(110, 110, 110)' : '2px solid #313132',
    background: isDisabled ? 'rgb(215, 215, 215)' : '#F5F5F5',
    borderRadius: '0',
  }),
  option: styles => ({ ...styles, padding: '0', paddingLeft: '.5rem' }),
  menuList: styles => ({ ...styles }),
  menu: styles => ({
    ...styles,
    margin: 0,
    left: '0',
    padding: 0,
    borderRadius: 0,
    background: 'rgb(243, 244, 246)',
    boxShadow: '0',
    border: '1px solid black',
    borderTop: '0',
  }),
};
