import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import logo from '@assets/img/bc_logo.png';
import { UserDropdown } from './UserDropdown';
import { HeaderHelper } from './admin';

export const Header: React.FC = () => {
  const router = useRouter();
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headerRef?.current?.focus();
  }, [router.asPath]);

  return (
    <header className='w-full bg-bcBluePrimary flex flex-row justify-center'>
      <div className='container flex w-full mx-6 xl:w-xl my-2'>
        <div className='flex flex-grow w-full justify-between items-center'>
          <div className='layout-grid gap-0 h-full flex flex-row items-center'>
            <Link href='/'>
              <img src={logo.src} alt='government of british columbia' width={160} height={45} />
            </Link>
            <div className='ml-7 pl-7 border-l-2 border-bcYellowPrimary'>
              <h1
                tabIndex={-1}
                ref={headerRef}
                className=' font-semibold tracking-wider text-white lg:text-xl md:text-xl text-sm focus:outline-none'
              >
                Internationally Educated Nurses
              </h1>
            </div>
          </div>
          <div className='flex flex-row'>
            <UserDropdown />
            {process.env.NEXT_PUBLIC_DISABLE_USER_GUIDE !== 'true' && <HeaderHelper />}
          </div>
        </div>
      </div>
    </header>
  );
};
