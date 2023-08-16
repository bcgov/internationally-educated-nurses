import { BccnmNcasValidation } from '@ien/common';
import { BccnmNcasUpdateTable } from './BccnmNcasUpdateTable';
import { BccnmNcasUpdateFilter, FilterOption } from './BccnmNcasUpdateFilter';
import { PageOptions, Pagination } from '@components';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE_SIZE = 10;

export const BccnmNcasPreview = ({ data }: { data: BccnmNcasValidation[] }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [pagedData, setPagedData] = useState<BccnmNcasValidation[]>([]);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(1);

  const handlePageOptions = ({ pageIndex: pgIndex, pageSize: size }: PageOptions) => {
    if (size !== pageSize) {
      setPageSize(size);
      setPageIndex(1);
    } else {
      setPageIndex(pgIndex);
    }
  };

  const handleFilterChange = (filter: FilterOption) => {
    setPageIndex(1);
    switch (filter) {
      case FilterOption.VALID:
        setFilteredData(data.filter(e => e.valid));
        break;
      case FilterOption.INVALID:
        setFilteredData(data.filter(e => !e.valid));
        break;
      case FilterOption.NO_CHANGES:
        setFilteredData(data.filter(e => e.valid && e.message === 'No changes'));
        break;
      default:
        setFilteredData(data);
    }
  };

  useEffect(() => {
    const skip = pageIndex * pageSize;
    setPagedData(filteredData.slice(skip, skip + pageSize));
  }, [filteredData, pageSize, pageIndex]);

  return (
    <>
      <BccnmNcasUpdateFilter data={data} onChange={handleFilterChange} />
      <Pagination
        id='bccnm-ncas-page-top'
        pageOptions={{ pageIndex, pageSize, total: filteredData.length }}
        onChange={handlePageOptions}
      />
      <BccnmNcasUpdateTable data={pagedData} />
      <Pagination
        id='bccnm-ncas-page-bottom'
        pageOptions={{ pageIndex, pageSize, total: filteredData.length }}
        onChange={handlePageOptions}
      />
    </>
  );
};
