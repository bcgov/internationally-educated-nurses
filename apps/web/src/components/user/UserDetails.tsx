import { EmployeeRO } from '@ien/common';
import { DetailsHeader } from '../DetailsHeader';
import { DetailsItem } from '@components';
import { ToggleSwitch } from '../ToggleSwitch';
import { activateUser, revokeAccess } from '@services';
import { toast } from 'react-toastify';

export interface UserDetailsProps {
  user: EmployeeRO;
  updateUser: (user: EmployeeRO) => void;
}

export const UserDetails = ({ user, updateUser }: UserDetailsProps) => {
  const changeAccess = async (revoked: boolean) => {
    let employee;
    if (revoked) {
      employee = await revokeAccess(user.id);
      toast.success('User access has been revoked.');
    } else {
      employee = await activateUser(user.id);
      toast.success('User has been activated.');
    }
    if (employee) {
      updateUser(employee);
    }
  };

  return (
    <>
      <div className='border-1 border-bcDisabled rounded px-5 pb-3 mt-4 bg-white text-bcBlack'>
        <DetailsHeader />
        <div className='grid grid-cols-12 gap-2 py-2'>
          <DetailsItem title='Name' text={user.name} />
          <DetailsItem title='Organization' text={user.organization}>
            <div className='my-1 flex align-middle justify-between'>
              <span className='mr-2 text-sm'>{user.organization}</span>
            </div>
          </DetailsItem>
          <DetailsItem title='Email Address' text={user.email} />
          <DetailsItem title='Access Revoked'>
            <div className='my-1 w-40 flex align-middle justify-between' data-cy='revoke'>
              <span className='mr-2 text-sm'>
                {user.revoked_access_date ? 'Grant access' : 'Remove access'}
              </span>
              <ToggleSwitch
                checked={!!user.revoked_access_date}
                screenReaderText={user.revoked_access_date ? 'Grant access' : 'Remove access'}
                onChange={changeAccess}
              />
            </div>
          </DetailsItem>
        </div>
      </div>
    </>
  );
};
