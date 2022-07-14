import Link from 'next/link';
import { useRouter } from 'next/router';

import { menuBarTabs } from '@services';
import { useAuthContext } from './AuthContexts';
import { LastSyncBar } from '@components';
import { hasAccess, RoleSlug } from '@ien/common';

export const MenuBar: React.FC = () => {
  const router = useRouter();
  const { authUser } = useAuthContext();

  const active = `font-bold`;

  const isAuthorized = () => {
    if (!authUser?.roles?.length) return false;
    return authUser.roles.every(({ slug }) => slug !== RoleSlug.Pending);
  };

  if (!isAuthorized()) return <></>;

  return (
    <nav className='w-full bg-bcBlueAccent flex flex-row justify-center'>
      <div className='container flex w-full mx-6 xl:w-xl my-2'>
        <div className='relative flex flex-grow w-full justify-between items-center'>
          <div className='layout-grid gap-0 h-full flex flex-row items-center align-center'>
            {menuBarTabs
              .filter(menu => authUser && hasAccess(authUser.roles, menu.acl))
              .map(({ title, paths, defaultPath }) => (
                <Link key={title} href={defaultPath}>
                  <a
                    className={`text-white text-sm py-2 pr-12 ${
                      paths.includes(router.pathname) && active
                    }`}
                  >
                    {title}
                  </a>
                </Link>
              ))}
          </div>
          <LastSyncBar />
        </div>
      </div>
    </nav>
  );
};
