import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <FontAwesomeIcon icon={faSpinner} className={`animate-spin ${className}`} />
    </div>
  );
};
