import Link from 'next/link';
import { useRouter } from 'next/router';

import { menuBarTabs } from '@services';

export const MenuBar: React.FC = () => {
  const router = useRouter();

  const active = `font-bold`;

  // disabled Reporting tab for now
  return (
    <div className='w-full bg-bcBlueAccent flex flex-row justify-center'>
      <div className='container flex w-full mx-6 xl:w-xl my-2'>
        <div className='flex flex-grow w-full justify-between items-center'>
          <div className='layout-grid gap-0 h-full flex flex-row items-center align-center'>
            {menuBarTabs.map(({ title, paths, defaultPath }) => (
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
        </div>
      </div>
    </div>
  );
};
