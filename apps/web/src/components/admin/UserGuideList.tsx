import { UserGuide } from '@ien/common';
import { UserGuideRow } from './UserGuideRow';

interface UserGuideListProps {
  files: UserGuide[];
}

export const UserGuideList = ({ files }: UserGuideListProps) => {
  if (!files.length) {
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
