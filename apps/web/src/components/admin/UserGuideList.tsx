import { useEffect, useState } from 'react';
import useSWR from 'swr';
import _ from 'lodash';
import { UserGuide } from '@ien/common';
import { UserGuideRow } from './UserGuideRow';
import { fetcher } from '../../utils';
import { Spinner } from '../Spinner';

interface UserGuideListProps {
  showVersions?: boolean;
}

export const UserGuideList = ({ showVersions = true }: UserGuideListProps) => {
  const { data } = useSWR<{ data: UserGuide[] }>('/admin/user-guides', fetcher);
  const [files, setFiles] = useState<UserGuide[]>();

  useEffect(() => {
    if (data?.data) {
      setFiles(_.orderBy(data.data, 'lastModified', 'desc'));
    }
  }, [data]);

  if (!files) {
    return <Spinner size='2x' relative />;
  } else if (!files.length) {
    return <div className='w-full text-center'>No files found!</div>;
  }

  return (
    <div>
      {files?.map(file => (
        <UserGuideRow key={file.name} file={file} showVersions={showVersions} />
      ))}
    </div>
  );
};
