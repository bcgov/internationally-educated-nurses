import { UserGuideRow } from './UserGuideRow';
import useSWR from 'swr';
import { fetcher } from '../../utils';
import { UserGuide } from '@ien/common';

export const UserGuideList = () => {
  const { data } = useSWR<{ data: UserGuide[] }>('/admin/user-guides', fetcher);

  const files = data?.data?.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1));

  if (!files?.length) {
    return <div className='w-full text-center'>No files found!</div>;
  }

  return (
    <div>
      {files?.map(file => (
        <UserGuideRow key={file.name} file={file} />
      ))}
    </div>
  );
};
