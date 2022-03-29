import { useState } from 'react';

interface TabFields {
  tabs: TabItems[];
  onTabClick: (e: any) => void;
}

interface TabItems {
  title: string;
  value: string;
}

export const HeaderTab: React.FC<TabFields> = ({ tabs, onTabClick }) => {
  const [activeTab, setActiveTab] = useState('1');

  const active = 'border-b-2 border-bcBluePrimary text-bcBluePrimary';
  const inactive = 'border-b text-bcGray';

  const activeTabClick = (e: any) => {
    setActiveTab(e.target.id);
  };

  return (
    <div className='mb-3 whitespace-nowrap'>
      <ul className='flex justify-start '>
        {tabs.map(({ title, value }) => (
          <button
            key={title}
            id={value}
            className={`text-center md:w-full w-1/3 text-xs font-semibold lg:text-sm px-2 md:px-6 pt-1 pb-2 my-1
              ${activeTab === value ? active : inactive}`}
            onClick={e => {
              onTabClick(e);
              activeTabClick(e);
            }}
          >
            {title}
          </button>
        ))}
      </ul>
    </div>
  );
};
