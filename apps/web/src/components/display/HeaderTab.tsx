import Link from 'next/link';
import { useRouter } from 'next/router';

interface TabFields {
  tabs: TabItems[];
}

interface TabItems {
  title: string;
  route: string;
}

export const HeaderTab: React.FC<TabFields> = ({ tabs }) => {
  const router = useRouter();

  const activeTab = 'border-b-2 border-bcBluePrimary text-bcBluePrimary';
  const inactiveTab = 'border-b text-bcGray';

  return (
    <div className='mb-3 whitespace-nowrap'>
      <ul className='flex justify-start'>
        {tabs.map(({ title, route }) => (
          <Link href={route} key={title}>
            <a
              className={`text-center w-full font-bold text-sm px-6 pt-1 pb-2 my-2 pointer-events-none
              ${router.pathname === route ? activeTab : inactiveTab}`}
            >
              {title}
            </a>
          </Link>
        ))}
      </ul>
    </div>
  );
};
