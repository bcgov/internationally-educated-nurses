import React from 'react';
import ReactSelect, { StylesConfig, components, GroupBase } from 'react-select';
import { DropdownIndicatorProps } from 'react-select/dist/declarations/src/components/indicators';
import { SelectOption, StyleOption } from '@services';
import downCaret from '@assets/img/arrow_down.svg';

export interface BasicSelectProps<T extends string | number> {
  id: string;
  options: SelectOption<T>[];
  value: T;
  label?: string;
  onChange: (value: T) => void;
}

const DropdownIndicator = <T extends string | number>(
  props: DropdownIndicatorProps<SelectOption<T>, false, GroupBase<SelectOption<T>>>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={downCaret.src} alt='down caret' />
    </components.DropdownIndicator>
  );
};

export const BasicSelect = <T extends string | number>(props: BasicSelectProps<T>) => {
  const { id, value, label, options, onChange } = props;
  return (
    <ReactSelect<SelectOption<T>>
      inputId={id}
      aria-label={label || `${id} label`}
      value={options.find(o => o.value === value)}
      onChange={option => option && onChange(option.value)}
      getOptionLabel={o => `${o.label || o.value}`}
      isOptionDisabled={o => o.value === value}
      options={options}
      styles={getNoBorderSelectStyle<SelectOption<T>>()}
      components={{ DropdownIndicator }}
    />
  );
};

const getNoBorderSelectStyle = <T extends StyleOption>(): StylesConfig<T, boolean> => {
  return {
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
    indicatorsContainer: styles => ({ ...styles, color: 'black' }),
    control: styles => ({
      ...styles,
      display: 'flex',
      padding: '1px',
      border: '0',
      borderRadius: '0',
    }),
    option: (styles, { data, isDisabled }) => ({
      ...styles,
      padding: '10px 10px',
      background: isDisabled ? 'rgb(215, 215, 215)' : 'white',
      color: 'black',
      '&:hover': {
        background: '#F2F2F2',
      },
      ...data?.style,
    }),
    menuList: styles => ({ ...styles, maxHeight: '350px' }),
    menu: styles => ({ ...styles, padding: '5px 5px', textAlign: 'center' }),
    placeholder: styles => ({ ...styles, color: '#606060' }),
  };
};

export const getSelectStyleOverride = <T extends StyleOption>(
  bgColour?: string,
): StylesConfig<T, boolean> => {
  const getBgColour = bgColour || '#F5F5F5';

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
      background: isDisabled ? 'rgb(215, 215, 215)' : getBgColour,
      borderRadius: '0',
    }),
    option: (styles, { data, isDisabled }) => ({
      ...styles,
      padding: '10px 20px',
      background: isDisabled ? 'rgb(215, 215, 215)' : 'white',
      color: 'black',
      '&:hover': {
        background: '#F2F2F2',
      },
      ...data?.style,
    }),
    menuList: styles => ({ ...styles, maxHeight: '350px' }),
    menu: styles => ({ ...styles, padding: '5px 10px' }),
    placeholder: styles => ({ ...styles, color: '#606060' }),
  };
  return selectStyleOverride;
};
