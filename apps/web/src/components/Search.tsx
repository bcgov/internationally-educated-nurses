import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import searchIcon from '@assets/img/search.svg';
import clearIcon from '@assets/img/x_clear.svg';
import barIcon from '@assets/img/bar.svg';
import { ApplicantRO, isHmbc } from '@ien/common';
import { useAuthContext } from './AuthContexts';

interface SearchProps {
  onChange: (name: string) => void;
  search: (name: string, limit: number) => Promise<ApplicantRO[]>;
  onSelect: (id: string) => void;
  keyword?: string;
}

const QUERY_LIMIT = 5; // limit the number of search results
const FOCUS_OUT_DELAY = 300; // to make redirection to detail page working

export const Search = (props: SearchProps) => {
  const { keyword, search, onChange, onSelect } = props;

  const [options, setOptions] = useState<ApplicantRO[]>([]);
  const [searchName, setSearchName] = useState(keyword || '');
  const [focus, setFocus] = useState(false);
  const inputRef = React.createRef<HTMLInputElement>();
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!searchName.trim()) return;
    search(searchName, QUERY_LIMIT).then(setOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      onChange(searchName);
    }
  };

  const handleFocus = (inFocus: boolean) => {
    // without delay, redirection to detail page on selection won't work
    setTimeout(() => setFocus(inFocus), FOCUS_OUT_DELAY);
  };

  // clear search bar text
  const handleClear = () => {
    setSearchName('');
    onChange(''); // refresh the applicant page
  };

  const getResultText = (applicant: ApplicantRO) => {
    if (!isHmbc(authUser) || !applicant.status) {
      return <b>{applicant.name}</b>;
    }
    return (
      <>
        <b>{applicant.name}</b> found in <b>{applicant.status.status}</b>
      </>
    );
  };

  return (
    <div className='relative bg-white z-10' onBlur={() => handleFocus(false)}>
      <div className='flex py-2 px-2 mb-1 border rounded'>
        <img src={searchIcon.src} alt='search' className='flex-grow-0 mr-3' />
        <input
          ref={inputRef}
          type='text'
          value={searchName}
          onChange={handleChange}
          onFocus={() => handleFocus(true)}
          onKeyDown={handleEnter}
          placeholder='Search by first name or last name'
          className='flex-grow focus:outline-none placeholder-bcGray'
          data-cy='search-input'
        />
        {searchName && (
          <>
            <button onClick={handleClear}>
              <img src={clearIcon.src} alt='search' className='flex-grow-0 mr-3' />
            </button>
            {focus && (
              <>
                <img src={barIcon.src} alt='search' className='flex-grow-0 mr-3' />
                <button
                  className='flex-grow-0 text-bcBlueAccent '
                  onClick={() => onChange(searchName)}
                >
                  Show all results
                </button>
              </>
            )}
          </>
        )}
      </div>
      {searchName && focus && (
        <div className='absolute bg-white w-full px-2 pt-3'>
          {options.map(applicant => {
            return (
              <div
                key={applicant.id}
                className='flex border-b h-10 w-full px-4 hover:bg-bcLightBlueBackground'
                onClick={() => onSelect(applicant.id)}
                data-cy='search-result-item'
              >
                <span className='my-auto'>{getResultText(applicant)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
