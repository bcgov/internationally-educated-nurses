import { PropsWithChildren } from 'react';

type DetailsItemProps = PropsWithChildren & {
  title: string;
  text?: string | string[];
  span?: number;
};

export const DetailsItem: React.FC<DetailsItemProps> = ({ title, text, span = 3, children }) => {
  return (
    <div className={`col-span-12 sm:col-span-6 lg:col-span-${span} sm:text-sm my-2`}>
      <strong className='my-3 text-base'>{title}</strong>
      {children || <p className='text-sm my-1'>{Array.isArray(text) ? text.join(', ') : text}</p>}
    </div>
  );
};
