import Link from 'next/link';
import { useRouter } from 'next/router';

import { menuBarTabs } from '@services';

export const MenuBar: React.FC = () => {
  const router = useRouter();

  const active = `font-bold`;

  // disabled Reporting tab for now
  return (
    <div className='w-full py-2 bg-bcBlueNav flex justify-center'>
      <div className='w-full 2xl:w-5/6 h-full flex flex-row items-center align-center justify-between px-2 md:px-12'>
        <div className='layout-grid gap-0 h-full flex flex-row items-center align-center'>
          {menuBarTabs.map(({ title, path }) => (
            <div
              key={title}
              className={`text-white text-sm py-2 pr-12 ${
                router.pathname == path ? active : 'pointer-events-none'
              }`}
            >
              <Link href={path}>
                <a>{title}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
