import { useState } from 'react';
import { BccnmNcasValidation } from '@ien/common';

export enum FilterOption {
  ALL = 'All',
  VALID = 'Valid',
  INVALID = 'Invalid',
  NO_CHANGES = 'No changes',
}

const FILTER_OPTIONS = [
  FilterOption.ALL,
  FilterOption.VALID,
  FilterOption.INVALID,
  FilterOption.NO_CHANGES,
];
interface BccnmNcasUpdateSummaryProps {
  data: BccnmNcasValidation[];
  onChange: (filter: FilterOption) => void;
}

export const BccnmNcasUpdateFilter = ({ data, onChange }: BccnmNcasUpdateSummaryProps) => {
  const [filter, setFilter] = useState<FilterOption>(FilterOption.ALL);

  const changeOption = (value: FilterOption) => {
    setFilter(value);
    onChange(value);
  };

  const getCount = (option: FilterOption): number => {
    switch (option) {
      case FilterOption.VALID:
        return data.filter(e => e.valid).length;
      case FilterOption.NO_CHANGES:
        return data.filter(e => !e.valid && e.message === 'No changes').length;
      case FilterOption.INVALID:
        return data.filter(e => !e.valid && e.message !== 'No changes').length;
      default:
        return data.length;
    }
  };

  return (
    <>
      <div className='main flex items-center border rounded overflow-hidden m-4 select-none'>
        <div className='title py-3 my-auto px-5 bg-bcBlueAccent text-white text-sm font-semibold mr-3'>
          Filter
        </div>
        {FILTER_OPTIONS.map(option => (
          <label key={option} className='flex radio p-2 cursor-pointer'>
            <input
              className='my-auto transform scale-125'
              type='radio'
              name='sfg'
              value={option}
              checked={filter === option}
              onChange={() => changeOption(option)}
            />
            <div className='title px-2'>
              {option} ({getCount(option).toLocaleString()})
            </div>
          </label>
        ))}
      </div>
    </>
  );
};

export default BccnmNcasUpdateFilter;
