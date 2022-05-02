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
              value.map(val => ({ id: val.value, ...val })), // also set the name field to match DTOs
            )
          }
          onBlur={field.onBlur}
          isDisabled={disabled}
          styles={getSelectStyleOverride()}
          isMulti
        />
      )}
    />
  );
};

export function getSelectStyleOverride<T>(bgColour?: string): StylesConfig<T, boolean> {
  const getBgColour = () => {
    if (bgColour) {
      return bgColour;
    }

    return '#F5F5F5';
  };
  const selectStyleOverride: StylesConfig<T, boolean> = {
    indicatorSeparator: styles => ({ ...styles }),
    clearIndicator: styles => ({ ...styles, color: 'black' }),
    indicatorsContainer: styles => ({ ...styles, color: 'black' }),
    dropdownIndicator: styles => ({
      ...styles,
      color: 'black',
      transform: 'scale(0.8, 0.85)',
    }),
    input: styles => ({ ...styles }),
    control: (styles, { isDisabled }) => ({
      ...styles,
      display: 'flex',
      padding: '1px',
      border: '0',
      borderBottom: isDisabled ? 'none' : '2px solid #313132',
      background: isDisabled ? 'rgb(215, 215, 215)' : getBgColour(),
      borderRadius: '0',
    }),
    option: (styles, { isDisabled }) => ({
      ...styles,
      padding: '10px 20px',
      background: isDisabled ? 'rgb(215, 215, 215)' : 'white',
      color: 'black',
    }),
    menuList: styles => ({ ...styles, maxHeight: '380px' }),
    menu: styles => ({
      ...styles,
      padding: '5px 10px',
    }),
  };
  return selectStyleOverride;
}
