import React from 'react';
import arrowLeftIcon from '@assets/img/arrow_left.svg';
import arrowRightIcon from '@assets/img/arrow_right.svg';

export interface PageOptions {
  pageSize: number;
  pageIndex: number;
  total: number;
}

export interface PaginationProps {
  pageOptions: PageOptions;
  onChange: (options: PageOptions) => void;
}

const PAGE_SIZES = [5, 10, 25, 50];

export const Pagination = (props: PaginationProps) => {
  const {
    pageOptions: { pageSize, pageIndex, total },
    onChange,
  } = props;

  const numOfPages = Math.ceil(total / pageSize);
  const pageList = Array.from(Array(numOfPages).keys()).map(i => i + 1);

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
      <div className='px-3 border-r text-sm'>
        <select
          className='cursor-pointer p-3 outline-none'
          role='listbox'
          aria-label='page size'
          value={pageSize}
          onChange={e => changePageSize(+e.target.value)}
        >
          {PAGE_SIZES.map(size => (
            <option key={size} value={size} role='option'>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className='text-sm pl-3 p-3 border-r'>
        <span>
          {start} - {end} of {total} items
        </span>
      </div>
      <div className='flex flex-row flex-grow justify-end align-middle'>
        <select
          className='border-l px-3 text-sm outline-none'
          role='listbox'
          aria-label='page'
          value={pageIndex}
          onChange={e => goToPage(+e.target.value)}
          disabled={total <= pageSize}
        >
          {pageList.map(index => (
            <option key={index} value={index} role='option'>
              {index}{' '}
            </option>
          ))}
          {/* listbox ARIA role must contain children */}
          <option value='' role='option' hidden></option>
        </select>
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
