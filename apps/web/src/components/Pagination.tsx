import React from 'react';
import arrowLeftIcon from '@assets/img/arrow_left.svg';
import arrowRightIcon from '@assets/img/arrow_right.svg';
import { BasicSelect } from './BasicSelect';

export interface PageOptions {
  pageSize: number;
  pageIndex: number;
  total: number;
}

export interface PaginationProps {
  id: string;
  pageOptions: PageOptions;
  onChange: (options: PageOptions) => void;
}

const PAGE_SIZES = [5, 10, 30, 50, 100];

export const Pagination = (props: PaginationProps) => {
  const {
    id,
    pageOptions: { pageSize, pageIndex, total },
    onChange,
  } = props;

  const numOfPages = Math.ceil(total / pageSize);

  const pageSizeOptions = PAGE_SIZES.map(size => ({ value: size }));
  const pageListOptions = Array.from(Array(numOfPages).keys()).map(i => ({ value: i + 1 }));

  const startIndex = (pageIndex - 1) * pageSize + 1;
  const start = startIndex > total ? 0 : startIndex;
  const end = pageIndex * pageSize > total ? total : pageIndex * pageSize;

  const goToPage = (pgIndex: number) => {
    onChange({ pageSize, pageIndex: pgIndex, total });
  };

  const changePageSize = (pgSize: number) => {
    onChange({ pageSize: pgSize, pageIndex, total });
  };

  return (
    <div className='flex flex-row w-full bg-white pl-4 text-bcBlack border-b border-t'>
      <div className='text-sm py-3'>
        <span className='mr-3'>Items per page: </span>
      </div>
      <div className='px-3 text-sm my-auto'>
        <BasicSelect<number>
          id={`${id}-size`}
          options={pageSizeOptions}
          onChange={changePageSize}
          value={pageSize}
        />
      </div>
      <div className='text-sm pl-3 p-3 border-r border-l'>
        <span>
          {start} - {end} of {total} items
        </span>
      </div>
      <div className='flex flex-row flex-grow justify-end'>
        <div className='px-3 pt-1 border-l border-r h-100 text-sm'>
          <BasicSelect<number>
            id={`${id}-index`}
            options={pageListOptions}
            onChange={goToPage}
            value={pageIndex}
          />
        </div>
        <div className='text-sm p-3'>of {numOfPages} pages</div>
        <button
          className='p-3 border-l'
          onClick={() => goToPage(pageIndex - 1)}
          disabled={pageIndex === 1}
        >
          <img
            src={arrowLeftIcon.src}
            alt='arrow left'
            className={pageIndex === 1 ? 'opacity-50' : ''}
          />
        </button>
        <button
          className='p-3 border-l border-r'
          onClick={() => goToPage(pageIndex + 1)}
          disabled={pageIndex === numOfPages}
        >
          <img
            src={arrowRightIcon.src}
            alt='arrow right'
            className={pageIndex === numOfPages ? 'opacity-50' : ''}
          />
        </button>
      </div>
    </div>
  );
};
