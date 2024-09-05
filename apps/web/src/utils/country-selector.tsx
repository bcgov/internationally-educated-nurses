import { FieldProps, getSelectStyleOverride, Input } from '@components';
import ReactSelect, { MenuPlacement } from 'react-select';
import { isoCountries } from '@ien/common';
import { RecordTypeOptions } from '@services';

export const getCountries = (): RecordTypeOptions<number>[] => {
  return Object.keys(isoCountries).map((key: string, index: number) => ({
    id: index + 1,
    countryCode: key.toLowerCase(),
    title: isoCountries[key as keyof typeof isoCountries].name,
  }));
};

export const getCountrySelector = (
  field: FieldProps['field'],
  form: FieldProps['form'],
  placement: MenuPlacement = 'auto',
) => (
  <ReactSelect<RecordTypeOptions<number>>
    inputId={field.name}
    value={getCountries().find(s => s.countryCode == field.value)}
    onBlur={field.onBlur}
    onChange={value => form.setFieldValue(field.name, `${value?.countryCode}`)}
    options={getCountries()}
    isOptionDisabled={o => o.countryCode == field.value}
    getOptionLabel={option => `${option.title}`}
    styles={getSelectStyleOverride<RecordTypeOptions<number>>()}
    menuPlacement={placement}
    components={{ Input }}
  />
);
