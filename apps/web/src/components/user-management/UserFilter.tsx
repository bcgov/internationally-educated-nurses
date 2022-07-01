import ReactSelect from 'react-select';

import { getSelectStyleOverride } from '@components';
import { ValidRoles } from '@ien/common';
import { roleFilterOptions, RoleOption } from '@services';
import { ChangeEvent } from 'react';

interface UserFilterProps {
  roles: ValidRoles[];
  updateRoles: (roles: ValidRoles[]) => void;
  revokedOnly: boolean;
  setRevokedOnly: (revokedOnly: boolean) => void;
}

export const UserFilter = (props: UserFilterProps) => {
  const { roles, updateRoles, revokedOnly, setRevokedOnly } = props;

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRevokedOnly(Boolean(e.target.checked));
  };

  return (
    <div className='flex flex-col md:flex-row items-center mt-1 mb-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <ReactSelect<RoleOption, true>
        inputId='role-filter'
        aria-label='select role'
        placeholder='Role'
        value={roleFilterOptions.filter(option => roles.includes(option.value))}
        onChange={value => updateRoles(value.map(v => v.value))}
        options={[...roleFilterOptions]}
        getOptionLabel={option => option.value.toUpperCase()}
        styles={getSelectStyleOverride<RoleOption>()}
        isMulti
        isClearable
        className='w-60 min-w-full md:min-w-0 mx-1 placeholder-bcGray'
      />
      <input
        value={`${revokedOnly}`}
        id='revoked-only'
        type='checkbox'
        className='h-4 w-4 rounded-full ml-6 mr-2'
        onChange={handleCheckChange}
      />
      <label htmlFor='revoked-only' className='cursor-pointer'>
        Show revoked access only
      </label>
    </div>
  );
};
