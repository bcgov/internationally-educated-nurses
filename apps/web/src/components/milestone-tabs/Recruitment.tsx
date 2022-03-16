import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { buttonBase, buttonColor } from '../Button';

export const Recruitment: React.FC = () => {
  const router = useRouter();
  const applicantId = router.query.applicantId;

  return (
    <div className='border rounded bg-blue-100 flex justify-between items-center mb-4 h-12'>
      <span className='py-2 pl-5 font-bold text-xs sm:text-sm'>
        There is no record yet. Please click on the &ldquo;Add Record&rdquo; button to create a new
        job competition.
      </span>
      <Link
        as={`/details/${applicantId}?milestone=add`}
        href={{
          pathname: `/details/${applicantId}`,
          query: { ...router.query, milestone: 'add' },
        }}
        shallow={true}
      >
        <a className={`ml-auto mr-2 ${buttonColor.secondary} ${buttonBase}`}>
          <FontAwesomeIcon className='h-4 mr-2' icon={faPlusCircle}></FontAwesomeIcon>
          Add Record
        </a>
      </Link>
    </div>
  );
};
