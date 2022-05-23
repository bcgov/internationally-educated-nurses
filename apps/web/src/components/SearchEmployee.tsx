import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import searchIcon from '@assets/img/search.svg';
import clearIcon from '@assets/img/x_clear.svg';
import { EmployeeRO } from '@ien/common';

interface SearchProps {
  onChange: (name: string) => void;
  search: (name: string, limit: number) => Promise<EmployeeRO[]>;
  onSelect?: (id: string) => void;
  keyword?: string;
  showDropdown?: boolean;
}

const QUERY_LIMIT = 10; // limit the number of search results
const QUERY_DELAY = 0; // to reduce number of api calls

export const SearchEmployee = (props: SearchProps) => {
  const { keyword, search, onChange } = props;

  const [searchName, setSearchName] = useState(keyword || '');
  const [delayedName, setDelayedName] = useState('');
  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    const timer = setTimeout(() => setDelayedName(searchName), QUERY_DELAY);
    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    inputRef.current?.focus();
    if (!delayedName.trim()) return;
    search(delayedName, QUERY_LIMIT);
  }, [delayedName, search]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);

    // make request if length of search field is greater than 2, .length starts at 0
    if (searchName.length > 1) {
      setTimeout(() => onChange(e.target.value), QUERY_DELAY);
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      onChange(searchName);
    }

    if (e.key === 'Backspace') {
      if (searchName.length - 1 === 0) {
        handleClear();
      }
    }
  };

  // clear search bar text
  const handleClear = () => {
    setSearchName('');
    onChange(''); // refresh the employee/user page
  };

  return (
    <div className='relative bg-white z-10'>
      <div className='flex py-2 px-2 mb-1 border rounded'>
        <img src={searchIcon.src} alt='search' className='flex-grow-0 mr-3' />
        <input
          ref={inputRef}
          onChange={handleChange}
          onKeyDown={handleEnter}
          value={searchName}
          type='text'
          placeholder='Search by first name or last name'
          className='flex-grow focus:outline-none'
        />
        {searchName && (
          <>
            <button onClick={handleClear}>
              <img src={clearIcon.src} alt='search' className='flex-grow-0 mr-3' />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
