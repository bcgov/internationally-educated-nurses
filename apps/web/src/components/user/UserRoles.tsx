import _ from 'lodash';
import { Access, EmployeeRO, hasAccess, isAdmin, Role, RoleSlug } from '@ien/common';
import lockIcon from '@assets/img/lock.svg';
import { updateRoles, useRoles } from '@services';
import { useAuthContext } from '../AuthContexts';
import { ToggleSwitch } from '../ToggleSwitch';

interface UserRolesProps {
  user: EmployeeRO;
  updateUser: (user: EmployeeRO) => void;
}

export const UserRoles = ({ user, updateUser }: UserRolesProps) => {
  const roles = useRoles();
  const { authUser } = useAuthContext();

  const changeRole = async (role: Role, enabled: boolean) => {
    const roleIds = user.roles.map(r => r.id);

    if (enabled) {
      roleIds.push(role.id);
      if (
        role.acl?.some(a => a.slug === Access.BCCNM_NCAS) &&
        !hasAccess(user.roles, [Access.APPLICANT_WRITE])
      ) {
        // bccnm-ncas comes with 'manage applicants' role
        const manageApplicantRole = roles?.find(({ slug }) => slug === RoleSlug.ApplicantWrite);
        if (manageApplicantRole) roleIds.push(manageApplicantRole.id);
      }
    } else {
      _.remove(roleIds, id => id === role.id);
      if (
        role.acl?.some(a => a.slug === Access.APPLICANT_WRITE) &&
        hasAccess(user.roles, [Access.BCCNM_NCAS])
      ) {
        const bccnmNcasRole = roles?.find(({ slug }) => slug === RoleSlug.BccnmNcas);
        _.remove(roleIds, id => id === bccnmNcasRole?.id);
      }
    }
    const employee = await updateRoles(user.id, roleIds);
    if (employee) updateUser(employee);
  };

  const hasRole = (role: Role) => {
    return user.roles.some(({ slug }) => slug === role.slug);
  };

  const getAvailableRoles = () => {
    let availableRoles = (isAdmin(authUser) ? roles : authUser?.roles) ?? [];
    availableRoles = availableRoles.filter(role => {
      return role.slug !== RoleSlug.Admin && role.slug !== RoleSlug.DataExtract;
    });
    if (isAdmin(user)) {
      return availableRoles;
    }
    return availableRoles.filter(
      role =>
        role.slug !== RoleSlug.BccnmNcas && (!user.ha_pcn_id || role.slug !== RoleSlug.Reporting),
    );
  };

  const getRoleSelector = (role: Role) => {
    return (
      <div key={role.name} className='flex flex-row justify-between py-4' data-cy={role.slug}>
        <div>
          <div>{role.name}</div>
          <div className='text-bcGray'>{role.description}</div>
        </div>
        <ToggleSwitch
          checked={hasRole(role)}
          screenReaderText={`${hasRole(role) ? 'Remove' : 'Assign'} ${role.name} role`}
          onChange={enabled => changeRole(role, enabled)}
        />
      </div>
    );
  };

  return (
    <div className='border-2 rounded px-5 my-5 pb-6 bg-white'>
      <div className='flex items-center border-b py-4 mb-3'>
        <img src={lockIcon.src} alt='history icon' />
        <h2 className='font-bold text-bcBluePrimary text-xl'>Role & Access Control</h2>
      </div>
      {getAvailableRoles().map(getRoleSelector)}
    </div>
  );
};
