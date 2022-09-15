import _ from 'lodash';
import { EmployeeRO, Role, RoleSlug } from '@ien/common';
import lockIcon from '@assets/img/lock.svg';
import { updateRoles, useRoles } from '@services';
import { ToggleSwitch } from '../ToggleSwitch';

interface UserRolesProps {
  user: EmployeeRO;
  updateUser: (user: EmployeeRO) => void;
}

export const UserRoles = ({ user, updateUser }: UserRolesProps) => {
  const roles = useRoles();

  const changeRole = async (role: Role, enabled: boolean) => {
    const roleIds = user.roles.map(r => r.id);
    if (enabled) {
      roleIds.push(role.id);
    } else {
      _.remove(roleIds, id => id === role.id);
    }
    const employee = await updateRoles(user.id, roleIds);
    if (employee) updateUser(employee);
  };

  const hasRole = (role: Role) => {
    return user.roles.some(({ slug }) => slug === role.slug);
  };

  const getRoleSelector = (role: Role) => {
    return (
      <div key={role.name} className='flex flex-row justify-between py-4' data-cy={role.slug}>
        <div>
          <div>{role.name}</div>
          <div className='text-bcGray'>{role.description}</div>
        </div>
        <ToggleSwitch checked={hasRole(role)} onChange={enabled => changeRole(role, enabled)} />
      </div>
    );
  };

  return (
    <div className='border-2 rounded px-5 my-5 pb-6 bg-white'>
      <div className='flex items-center border-b py-4 mb-3'>
        <img src={lockIcon.src} alt='history icon' />
        <h2 className='font-bold text-bcBluePrimary text-xl'>Role & Access Control</h2>
      </div>
      {roles
        ?.filter(role => role.slug !== RoleSlug.Admin && role.slug !== RoleSlug.DataExtract)
        .map(getRoleSelector)}
    </div>
  );
};
