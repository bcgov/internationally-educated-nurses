import ReactSelect from 'react-select';
import { RecordTypeOptions, useGetAddRecordOptions } from '@services';
import { JobFilterOptions } from '@ien/common';
import { Button } from '@components';
import { getSelectStyleOverride } from '../../form';

interface JobFilterProps {
  options: JobFilterOptions;
  update: (options: JobFilterOptions) => void;
}

export const JobFilters = ({ options, update }: JobFilterProps) => {
  const { ha_pcn: regions, job_title: specialties } = options;

  const { haPcn, jobTitle } = useGetAddRecordOptions();

  const clearFilters = () => {
    update({ ha_pcn: [], job_title: [] });
  };

  const applyRegions = (regionsFilter: number[]) => {
    update({ ha_pcn: regionsFilter, job_title: specialties });
  };

  const applySpecialties = (specialtiesFilter: number[]) => {
    update({ ha_pcn: regions, job_title: specialtiesFilter });
  };

  return (
    <div className='flex flex-col md:flex-row  items-center my-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <ReactSelect
        inputId='ha'
        placeholder='Health Region'
        aria-label='select ha'
        value={haPcn?.data?.filter(ha => regions?.includes(ha.id))}
        onChange={value => applyRegions(value?.map(ha => ha.id) || [])}
        options={haPcn?.data?.map(ha => ({ ...ha, isDisabled: regions?.includes(ha.id) }))}
        getOptionLabel={option => `${option.title}`}
        getOptionValue={option => `${option.id}`}
        styles={getSelectStyleOverride<RecordTypeOptions>()}
        isMulti
        isClearable
        className='w-80 min-w-full md:min-w-0 mx-1 placeholder-bcGray'
      />
      <ReactSelect
        inputId='specialty'
        placeholder='Specialty'
        aria-label='select specialty'
        value={jobTitle?.data?.filter(title => specialties?.includes(title.id))}
        onChange={value => applySpecialties(value?.map(title => title.id) || [])}
        options={jobTitle?.data?.map(title => ({
          ...title,
          isDisabled: specialties?.includes(title.id),
        }))}
        getOptionLabel={option => `${option.title}`}
        getOptionValue={option => `${option.id}`}
        styles={getSelectStyleOverride<RecordTypeOptions>()}
        isMulti
        isClearable
        className='w-80 min-w-full md:min-w-0 mx-1 placeholder-bcGray'
      />
      <Button className='ml-2 px-6 text-sm' onClick={clearFilters} variant='primary'>
        Clear
      </Button>
    </div>
  );
};
