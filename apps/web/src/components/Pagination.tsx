import { Popover } from '@headlessui/react';
import { FixedSizeList } from 'react-window';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
  IconDefinition,
  faCaretLeft,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

const setQueryParameter = (
  queryObject: ParsedUrlQuery,
  key: string,
  value: string,
  base?: string,
) => {
  const params = new URLSearchParams();
  Object.entries(queryObject).forEach(parameter => {
    params.append(parameter[0], parameter[0].toString()); //change 2nd param to 1 for sorting
  });
  params.delete(key);
  if (value) params.append(key, value);
  if (base) {
    return `${base}?${params.toString()}`;
  }
  return params.toString();
};

interface PaginationProps {
  page: number;
  totalItems: number;
  urlRoot: string;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalItems, urlRoot }) => {
  const router = useRouter();
  const numberOfPages = Math.ceil(totalItems / 10);

  const prevPage = `${Math.max(page - 1, 1)}`;
  const nextPage = `${Math.min(page + 1, numberOfPages)}`;

  const itemsPerPageOptions = [10, 20, 25, 30];

  return (
    <div className='flex items-center text-sm p-2 border border-gray-100 divide-x divide-gray-100'>
      <Popover className='relative'>
        Items per page:
        <Popover.Button className='text-black pl-3 py-1 hover:bg-gray-100 focus:ring-indigo-500'>
          <span className='ml-3'>{itemsPerPageOptions[0]}</span>
          <FontAwesomeIcon
            aria-label='down'
            icon={faChevronDown}
            className='h-2 inline-block px-2'
          />
        </Popover.Button>
        <Popover.Panel className='absolute z-10 bottom-full'>
          <div className='flex flex-col bg-white border border-grey-50'>
            <FixedSizeList
              height={Math.min(41 * itemsPerPageOptions.length, 41 * 4)}
              width={120}
              itemSize={41}
              itemCount={itemsPerPageOptions.length}
            >
              {({ index, style }) =>
                index + 1 !== page ? (
                  <Link
                    key={index}
                    href={{ pathname: urlRoot, query: { ...router.query, count: index + 1 } }}
                    shallow={true}
                  >
                    <a className='h-5 p-3 hover:bg-gray-100' style={style}>
                      {itemsPerPageOptions[index]}
                    </a>
                  </Link>
                ) : (
                  <p className='h-5 p-3 cursor-default text-gray-300' style={style}>
                    {itemsPerPageOptions[index]}
                  </p>
                )
              }
            </FixedSizeList>
          </div>
        </Popover.Panel>
      </Popover>
      <p className='pl-3'>
        {(page - 1) * 10 + 1} - {(page - 1) * 10 + 10} of {totalItems} items
      </p>

      <div className='flex gap-3 h-6 ml-auto divide-x divide-gray-100'>
        <Popover className='relative'>
          <Popover.Button className='text-black pl-3 py-1 hover:bg-gray-100 focus:ring-indigo-500'>
            {page}
            <FontAwesomeIcon
              aria-label='down'
              icon={faChevronDown}
              className='h-2 inline-block px-2'
            />
            of {numberOfPages} pages
          </Popover.Button>

          <Popover.Panel className='absolute z-10 bottom-full'>
            <div className='flex flex-col bg-white border border-grey-50'>
              <FixedSizeList
                height={Math.min(41 * numberOfPages, 41 * 4)}
                width={120}
                itemSize={41}
                itemCount={numberOfPages}
              >
                {({ index, style }) =>
                  index + 1 !== page ? (
                    <Link
                      key={index}
                      href={{ pathname: urlRoot, query: { ...router.query, page: index + 1 } }}
                      shallow={true}
                    >
                      <a className='h-5 p-3 hover:bg-gray-100' style={style}>
                        Page {index + 1}
                      </a>
                    </Link>
                  ) : (
                    <p className='h-5 p-3 cursor-default text-gray-300' style={style}>
                      Page {index + 1}
                    </p>
                  )
                }
              </FixedSizeList>
            </div>
          </Popover.Panel>
        </Popover>
        <div className='pl-5 pr-3'>
          <PaginationLink
            disabled={page === 1}
            label='Previous Page'
            link={setQueryParameter(router.query, 'page', prevPage, urlRoot)}
            icon={faCaretLeft}
          />
        </div>
        <div className='pr-3 pl-5'>
          <PaginationLink
            disabled={page === numberOfPages}
            label='Next Page'
            link={setQueryParameter(router.query, 'page', nextPage, urlRoot)}
            icon={faCaretRight}
          />
        </div>
      </div>
    </div>
  );
};

interface PaginationLinkProps {
  link: string;
  icon: IconDefinition;
  label: string;
  disabled?: boolean;
}

const PaginationLink: React.FC<PaginationLinkProps> = ({ link, icon, label, disabled }) => {
  return disabled ? (
    <FontAwesomeIcon aria-label={label} icon={icon} className='h-6 text-gray-300' />
  ) : (
    <Link href={link} shallow={true}>
      <a>
        <FontAwesomeIcon aria-label={label} icon={icon} className='h-6' />
      </a>
    </Link>
  );
};
