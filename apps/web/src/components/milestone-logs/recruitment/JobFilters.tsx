import { useState } from 'react';
import ReactSelect from 'react-select';
import { RecordTypeOptions, useGetAddRecordOptions } from '@services';
import { JobFilterOptions } from '@ien/common';
import { buttonBase, buttonColor } from '@components';
import { getSelectStyleOverride } from '../../form';

interface JobFilterProps {
  options: JobFilterOptions;
  update: (options: JobFilterOptions) => void;
}

export const JobFilters = ({ options, update }: JobFilterProps) => {
  const { haPcn, jobTitle } = useGetAddRecordOptions();

  const [regions, setRegions] = useState(options.ha_pcn);
  const [specialties, setSpecialties] = useState(options.job_title);

  return (
    <div className='flex flex-col md:flex-row  items-center my-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <ReactSelect
        inputId='ha'
        placeholder='Health Region'
        value={haPcn?.data?.filter(ha => regions?.includes(ha.id))}
        onChange={value => setRegions(value?.map(ha => ha.id) || [])}
        options={haPcn?.data?.map(ha => ({ ...ha, isDisabled: regions?.includes(ha.id) }))}
        getOptionLabel={option => option.title}
        getOptionValue={option => option.id}
        styles={getSelectStyleOverride<RecordTypeOptions>()}
        isMulti
        isClearable
        className='w-80 min-w-full md:min-w-0 mx-1'
      />
      <ReactSelect
        inputId='specialty'
        placeholder='Specialty'
        value={jobTitle?.data?.filter(title => specialties?.includes(title.id))}
        onChange={value => setSpecialties(value?.map(title => title.id))}
        options={jobTitle?.data?.map(title => ({
          ...title,
          isDisabled: specialties?.includes(title.id),
        }))}
        getOptionLabel={option => option.title}
        getOptionValue={option => option.id}
        styles={getSelectStyleOverride<RecordTypeOptions>()}
        isMulti
        isClearable
        className='w-80 min-w-full md:min-w-0 mx-1'
      />
      <button
        className={`ml-2 px-6 text-sm ${buttonColor.primary} ${buttonBase}`}
        onClick={() => update({ ha_pcn: regions, job_title: specialties })}
      >
        Apply
      </button>
    </div>
  );
};
