import React, { useRef } from 'react';
import { FieldProps } from 'formik';
import DatePicker from 'react-datepicker';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { Field } from '@components';
import calendarIcon from '@assets/img/calendar.svg';
import { isDateString } from '../../utils';

interface DatePickerFieldProps {
  name: string;
  label: string;
  format?: string;
  bgColour?: string;
  max?: Date;
  min?: Date;
  numOfYears?: number;
  validate?: (value: string) => string | undefined;
}

export const DatePickerField = (props: DatePickerFieldProps) => {
  const {
    name,
    label,
    format,
    validate,
    min,
    max = new Date(9999, 12, 31),
    numOfYears = 20,
    bgColour,
  } = props;

  const valRef = useRef('');
  const ref = useRef<DatePicker>(null);

  return (
    <Field
      name={name}
      label={label}
      min={min}
      validate={validate}
      component={({ field, form }: FieldProps) => (
        <div
          className={classNames(
            'flex pr-2 border-b-2 border-bcBlack',
            bgColour ? bgColour : 'bg-bcGrayInput',
          )}
        >
          <DatePicker
            id={name}
            dateFormat={format}
            className={classNames(
              'w-full rounded-none block h-10 pl-1 disabled:bg-bcDisabled',
              bgColour ? bgColour : 'bg-bcGrayInput',
            )}
            placeholderText={format?.toLowerCase()}
            autoComplete='off'
            minDate={min}
            maxDate={max}
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={numOfYears}
            selected={field.value ? dayjs(field.value).toDate() : null}
            onChangeRaw={e => {
              if (e && isDateString((e.target as HTMLInputElement).value)) {
                valRef.current = (e.target as HTMLInputElement).value;
              }
            }}
            onFocus={e => (valRef.current = (e.target as HTMLInputElement).value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const inputValue = (e.target as HTMLInputElement).value;
                if (inputValue && isDateString(inputValue)) {
                  valRef.current = inputValue;
                  form.setFieldTouched(name, true);
                  form.setFieldValue(name, inputValue);
                }
              }
            }}
            onBlur={() => {
              form.setFieldTouched(name, true);
              if (valRef.current) {
                form.setFieldValue(name, valRef.current);
              }
            }}
            onChange={value => value || form.setFieldValue(name, '')}
            onSelect={value => {
              const newValue = value ? dayjs(value).format('YYYY-MM-DD') : '';
              form.setFieldValue(name, newValue);
            }}
            ref={ref}
          />
          <img
            src={calendarIcon.src}
            className=' h-5 m-auto'
            alt='calendar icon'
            onClick={() => ref.current?.setOpen(true)}
          />
        </div>
      )}
    />
  );
};
