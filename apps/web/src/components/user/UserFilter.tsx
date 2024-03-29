import ReactSelect from 'react-select';

import { getRoleFilterOptions, SelectOption, useRoles } from '@services';
import { ChangeEvent } from 'react';
import { getSelectStyleOverride, Input } from '../BasicSelect';

interface UserFilterProps {
  roles: string[];
  updateRoles: (roles: string[]) => void;
  revokedOnly: boolean;
  setRevokedOnly: (revokedOnly: boolean) => void;
}

export const UserFilter = (props: UserFilterProps) => {
  const roleOptions = useRoles();
  const roleFilterOptions = roleOptions ? getRoleFilterOptions(roleOptions) : [];
  const { roles, updateRoles, revokedOnly, setRevokedOnly } = props;

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRevokedOnly(Boolean(e.target.checked));
  };

  return (
    <div className='flex flex-col md:flex-row items-center mt-1 mb-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <ReactSelect<SelectOption<string>, true>
        inputId='role-filter'
        aria-label='select role'
        placeholder='Role'
        value={roleFilterOptions.filter(option => roles.includes(option.value))}
        onChange={value => updateRoles(value.map(v => v.value))}
        options={[...roleFilterOptions]}
        styles={getSelectStyleOverride<SelectOption<string>>()}
        isMulti
        isClearable
        className='w-60 min-w-full md:min-w-0 mx-1 placeholder-bcGray'
        components={{ Input }}
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
