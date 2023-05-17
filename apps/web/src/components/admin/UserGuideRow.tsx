import dayjs from 'dayjs';
import { UserGuide } from '@ien/common';
import { downloadGuide } from '../../services/admin';

interface UserGuideProps {
  file: UserGuide;
}

export const UserGuideRow = ({ file: { name, lastModified } }: UserGuideProps) => {
  const open = async () => {
    const url = await downloadGuide(name);
    window.open(url);
  };

  return (
    <div className='flex flex-row py-1'>
      <span className='mr-4' style={{ minWidth: '180px' }}>
        {dayjs(lastModified).format('MMM D, YYYY h:mm A')}
      </span>
      <span
        className='underline text-bcBlueLink visited:text-bcBluePrimary cursor-pointer'
        onClick={open}
      >
        {name}
      </span>
    </div>
  );
};
