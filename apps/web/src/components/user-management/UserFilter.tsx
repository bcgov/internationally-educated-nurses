import ReactSelect from 'react-select';

import { Button, getSelectStyleOverride } from '@components';

// interface RoleTypeOptions {
//   id: string;
//   title: string;
// }
const rolesFake = [
  { id: '1', r: 'Pending' },
  { id: '2', r: 'All' },
  { id: '3', r: 'MOH' },
  { id: '4', r: 'HMBC' },
];
export interface UserFilterOptions {
  name?: string[];
  role?: string[];
}

// interface UserFilterProps {
//   options: UserFilterOptions;
//   update: (options: UserFilterOptions) => void;
// }

// export const UserFilters = ({ options, update }: UserFilterProps) => {
export const UserFilters = () => {
  // const { name: name, role: roles } = options;

  // const clearFilters = () => {
  //   update({ name: [], role: [] });
  // };

  // const applyName = (name: string[]) => {
  //   update({ name: name, role: roles });
  // };

  // const applyRoles = (roles: string[]) => {
  //   update({ name: name, role: roles });
  // };

  return (
    <div className='flex flex-col md:flex-row items-center mt-2 mb-5'>
      <div className='font-bold mr-2'>Filter by</div>
      <ReactSelect
        inputId='role'
        placeholder='Role'
        // onChange={value => applyRoles(value?.map(title => title.id) || [])}
        options={rolesFake}
        getOptionLabel={option => option.r}
        getOptionValue={option => option.id}
        styles={getSelectStyleOverride<any>()}
        isMulti
        isClearable
        className='w-80 min-w-full md:min-w-0 mx-1'
      />
      <Button
        className='ml-2 px-6 text-sm'
        onClick={() => {
          null;
        }}
        variant='primary'
      >
        Clear
      </Button>
    </div>
  );
};
