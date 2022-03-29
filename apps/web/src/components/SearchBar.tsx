import AsyncSelect from 'react-select/async';

import { getApplicants } from '@services';
import { components } from 'react-select';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const getSearchResults = async (inputValue: string) => {
  if (inputValue !== '') {
    const {
      data: { data },
    } = await getApplicants('name', inputValue);

    // @todo change any type
    const searchResultObj = data.map((s: any) => ({
      value: s.id,
      label: s.name,
      status: s.status.status,
    }));

    return searchResultObj;
  }
};

export const SearchBar: React.FC = () => {
  const router = useRouter();

  const handleChange = (e: any) => {
    console.log(e.value);
    router.push(`details/${e.value}`, undefined, { shallow: true });
  };

  return (
    <div className='flex h-9 mb-5'>
      <AsyncSelect
        instanceId={'search'}
        className='w-full text-sm'
        placeholder='Search by first name or last name'
        onChange={handleChange}
        loadOptions={getSearchResults}
        noOptionsMessage={() => 'No results'}
        components={{
          // DropdownIndicator: () => null,
          // IndicatorSeparator: () => null,
          DropdownIndicator,
          Option,
        }}
        isClearable={true}
        openMenuOnClick={false}
      />
    </div>
  );
};

const Option = (props: any) => {
  const { value, label, status } = props.data;
  return (
    <components.Option {...props} className='border-b border-gray-200'>
      <div id={value} className='text-sm pl-3'>
        <span>
          <strong>{label}</strong> found in <strong>{status}</strong>
        </span>
      </div>
    </components.Option>
  );
};

const DropdownIndicator = (props: any) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <FontAwesomeIcon className='h-4 pr-1' icon={faSearch} />
      </components.DropdownIndicator>
    )
  );
};
