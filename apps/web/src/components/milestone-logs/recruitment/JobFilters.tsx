import ReactSelect from 'react-select';
import {
  MilestoneType,
  RecordTypeOptions,
  useGetAddRecordOptions,
  useGetMilestoneOptions,
} from '@services';
import { getSelectStyleOverride } from '../../form';

export interface JobFilterOptions {
  ha?: string;
  specialty?: string;
  outcome?: string;
}

interface JobFilterProps {
  options: JobFilterOptions;
  update: (options: JobFilterOptions) => void;
}

export const JobFilters = ({ options, update }: JobFilterProps) => {
  const { ha, specialty, outcome } = options;
  const { haPcn, jobTitle } = useGetAddRecordOptions();
  const milestones = useGetMilestoneOptions();

  return (
    <div className='flex flex-col md:flex-row  items-center my-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <ReactSelect<RecordTypeOptions>
        inputId='ha'
        placeholder='Health Region'
        value={haPcn?.data?.find(s => s.id === ha)}
        onChange={value => update({ ...options, ha: value?.id })}
        options={haPcn?.data?.map(s => ({ ...s, isDisabled: s.id === ha }))}
        getOptionLabel={option => option.title}
        styles={getSelectStyleOverride<RecordTypeOptions>()}
        className='w-64 min-w-full md:min-w-0 mx-1'
      />
      <ReactSelect<RecordTypeOptions>
        inputId='specialty'
        placeholder='Specialty'
        value={jobTitle?.data?.find(s => s.id === specialty)}
        onChange={value => update({ ...options, specialty: value?.id })}
        options={jobTitle?.data?.map(s => ({ ...s, isDisabled: s.id === specialty }))}
        getOptionLabel={option => option.title}
        styles={getSelectStyleOverride<RecordTypeOptions>()}
        className='w-64 min-w-full md:min-w-0 mx-1'
      />
      <ReactSelect<MilestoneType>
        inputId='outcome'
        placeholder='Outcome'
        value={milestones?.find(s => s.id === outcome)}
        onChange={value => update({ ...options, outcome: value?.id })}
        options={milestones?.map(s => ({ ...s, isDisabled: s.id === outcome }))}
        getOptionLabel={option => option.status}
        styles={getSelectStyleOverride<MilestoneType>()}
        className='w-64 min-w-full md:min-w-0 mx-1'
      />
    </div>
  );
};
