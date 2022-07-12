import { PropsWithChildren, ReactNode } from 'react';

type DetailsItemProps = PropsWithChildren<ReactNode> & {
  title: string;
  text?: string | undefined | string[];
};

export const DetailsItem: React.FC<DetailsItemProps> = ({ title, text, children }) => {
  return (
    <div className='col-span-12 sm:col-span-6 lg:col-span-3 sm:text-sm my-2'>
      <strong className='my-3 text-base'>{title}</strong>
      {children || <p className='text-sm my-1'>{Array.isArray(text) ? text.join(', ') : text}</p>}
    </div>
  );
};
