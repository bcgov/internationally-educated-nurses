import ReactSelect from 'react-select';

import { Button, getSelectStyleOverride } from '@components';
import { ValidRoles } from '@ien/common';
import { RoleOption, roleSelectOptions } from '@services';

interface UserFilterProps {
  roles: ValidRoles[];
  updateRoles: (roles: ValidRoles[]) => void;
}

export const UserFilter = ({ roles, updateRoles }: UserFilterProps) => {
  const clearFilters = () => {
    updateRoles([]);
  };

  return (
    <div className='flex flex-col md:flex-row items-center mt-1 mb-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <ReactSelect<RoleOption, true>
        inputId='role-filter'
        aria-label='select role'
        placeholder='Role'
        value={roleSelectOptions.filter(option => roles.includes(option.value))}
        onChange={value => updateRoles(value.map(v => v.value))}
        options={[...roleSelectOptions]}
        getOptionLabel={option => option.value.toUpperCase()}
        styles={getSelectStyleOverride<RoleOption>()}
        isMulti
        isClearable
        className='w-60 min-w-full md:min-w-0 mx-1 placeholder-bcGray'
      />
      <Button className='ml-2 px-6 text-sm' onClick={clearFilters} variant='primary'>
        Clear
      </Button>
    </div>
  );
};
