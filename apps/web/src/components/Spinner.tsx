import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className='fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <FontAwesomeIcon icon={faSpinner} className={`animate-spin ${className}`} />
    </div>
  );
};
