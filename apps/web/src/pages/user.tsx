import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Access, EmployeeRO } from '@ien/common';
import { getEmployee } from '@services';
import { UserDetails } from '../components/user/UserDetails';
import withAuth from '../components/Keycloak';
import { Spinner } from '../components/Spinner';
import { DetailsNavBar } from '../components/DetailsNavBar';
import { UserRoles } from '../components/user/UserRoles';

const User = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [user, setUser] = useState<EmployeeRO | null>(null);

  useEffect(
    function loadUser() {
      setUser(null);
      getEmployee(id).then(user => {
        setUser(user);
      });
    },
    [id],
  );

  if (!user) {
    return <Spinner className='h-10' />;
  }
  return (
    <div className='container w-full  xl:w-xl mb-4'>
      <DetailsNavBar parent='User Management' label='User Details' />
      <h1 className='font-bold text-3xl'>{user.name}</h1>
      <UserDetails user={user} updateUser={setUser} />
      <UserRoles user={user} updateUser={setUser} />
    </div>
  );
};

export default withAuth(User, [Access.USER_READ]);
