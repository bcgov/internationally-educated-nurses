import React, { ChangeEvent, useEffect, useState } from 'react';
import searchIcon from '@assets/img/search.svg';
import clearIcon from '@assets/img/x_clear.svg';

interface SearchProps {
  onChange: (name: string) => void;
  keyword?: string;
}

const QUERY_DELAY = 300; // to reduce number of api calls

export const SearchEmployee = (props: SearchProps) => {
  const { keyword, onChange } = props;

  const [searchName, setSearchName] = useState(keyword || '');
  const [delayedName, setDelayedName] = useState('');
  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    const timer = setTimeout(() => setDelayedName(searchName), QUERY_DELAY);
    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    onChange(delayedName);
  }, [delayedName, onChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  // clear search bar text
  const handleClear = () => {
    setSearchName('');
  };

  return (
    <div className='relative bg-white z-10'>
      <div className='flex py-2 px-2 mb-1 border rounded'>
        <img src={searchIcon.src} alt='search' className='flex-grow-0 mr-3' />
        <input
          ref={inputRef}
          onChange={handleChange}
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
