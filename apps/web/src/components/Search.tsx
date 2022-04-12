import React from 'react';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import searchIcon from '@assets/img/search.svg';
import { ApplicantRO } from '@ien/common';

interface SearchProps {
  onChange: (name: string) => void;
  search: (name: string, limit: number) => Promise<ApplicantRO[]>;
  onSelect: (id: string) => void;
  keyword?: string;
}

const QUERY_LIMIT = 5; // limit the number of search results
const QUERY_DELAY = 300; // to reduce number of api calls
const FOCUS_OUT_DELAY = 300; // to make redirection to detail page working

export const Search = (props: SearchProps) => {
  const { keyword, search, onChange, onSelect } = props;

  const [options, setOptions] = useState<ApplicantRO[]>([]);
  const [name, setName] = useState(keyword || '');
  const [delayedName, setDelayedName] = useState('');
  const [focus, setFocus] = useState(false);
  const inputRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    const timer = setTimeout(() => setDelayedName(name), QUERY_DELAY);
    return () => clearTimeout(timer);
  }, [name]);

  useEffect(() => {
    if (!delayedName.trim()) return;
    search(delayedName, QUERY_LIMIT).then(setOptions);
  }, [delayedName, search]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      onChange(name);
    }
  };

  const handleFocus = (focus: boolean) => {
    // without delay, redirection to detail page on selection won't work
    setTimeout(() => setFocus(focus), FOCUS_OUT_DELAY);
  };

  return (
    <div className='relative bg-white z-10' onBlur={() => handleFocus(false)}>
      <div className='flex py-2 px-2 mb-1 border rounded'>
        <img src={searchIcon.src} alt='search' className='flex-grow-0 mr-3' />
        <input
          ref={inputRef}
          type='text'
          value={name}
          onChange={handleChange}
          onFocus={() => handleFocus(true)}
          onKeyDown={handleEnter}
          placeholder='Search by first name or last name'
          className='flex-grow focus:outline-none'
        />
        {name && focus && (
          <button className='flex-grow-0 text-bcBlueAccent ' onClick={() => onChange(name)}>
            Show all results
          </button>
        )}
      </div>
      {delayedName && focus && (
        <div className='absolute bg-white w-full px-2 pt-3'>
          {options.map(({ id, name, status }) => {
            return (
              <div
                key={id}
                className='flex border-b h-10 w-full px-4 hover:bg-bcLightBlueBackground'
                onClick={() => onSelect(id)}
              >
                <span className='my-auto'>
                  <b>{name}</b> found in <b>{status?.status}</b>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
