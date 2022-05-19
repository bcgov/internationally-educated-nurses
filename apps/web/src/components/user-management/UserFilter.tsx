import ReactSelect from 'react-select';

import { Button, getSelectStyleOverride } from '@components';
import { EmployeeFilterOptions } from 'src/pages/user-management';
import { rolesFake } from '@services';

interface EmployeeFilterProps {
  options: EmployeeFilterOptions;
  update: (options: EmployeeFilterOptions) => void;
}

export const EmployeeFilters = ({ options, update }: EmployeeFilterProps) => {
  const { name: name, role: roles } = options;

  const fakeRoles = rolesFake;

  const clearFilters = () => {
    update({ name: [], role: [] });
  };

  // need to figure out how search will work
  // const applyName = (name: string[]) => {
  //   update({ name: name, role: roles });
  // };

  const applyRoles = (rolesToFilter: string[]) => {
    update({ name: name, role: rolesToFilter });
  };

  // @todo remove fake values for options and figure out search functionality
  return (
    <div className='flex flex-col md:flex-row items-center mt-2 mb-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <input
        placeholder='Name'
        type='text'
        className='w-60 min-w-full md:min-w-0 rounded-none block h-10 border-b-2 
        border-bcBlack pl-1 bg-bcGrayInput mr-2'
      />
      <ReactSelect
        inputId='role'
        placeholder='Role'
        value={fakeRoles.filter(role => roles?.includes(role.r))}
        onChange={value => applyRoles(value?.map(title => title.r) || [])}
        options={fakeRoles}
        getOptionLabel={option => option.r.toUpperCase()}
        getOptionValue={option => option.id}
        styles={getSelectStyleOverride<any>()}
        isMulti
        isClearable
        className='w-60 min-w-full md:min-w-0 mx-1'
      />
      <Button className='ml-2 px-6 text-sm' onClick={clearFilters} variant='primary'>
        Clear
      </Button>
    </div>
  );
};
