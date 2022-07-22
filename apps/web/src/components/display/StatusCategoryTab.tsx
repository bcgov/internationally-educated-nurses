import classNames from 'classnames';

interface TabFields {
  tabs: TabItems[];
  categoryIndex: number;
  onTabClick: (index: number) => void;
}

interface TabItems {
  title: string;
  value: number;
}

export const StatusCategoryTab = ({ tabs, categoryIndex, onTabClick }: TabFields) => {
  const getButtonClasses = (index: number): string => {
    const classes = ['text-center w-full font-bold text-sm px-6 pt-1 pb-2 my-1'];
    if (categoryIndex === index) {
      classes.push('border-b-2 border-bcBluePrimary text-bcBluePrimary');
    } else {
      classes.push('border-b text-bcGray');
    }
    return classNames(classes);
  };

  return (
    <div className='mb-2 whitespace-nowrap my-1'>
      <div className='flex justify-start'>
        {tabs.map(({ title, value }) => (
          <button
            key={title}
            id={`tab-${value}`}
            className={getButtonClasses(value)}
            onClick={() => onTabClick(value)}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  );
};
