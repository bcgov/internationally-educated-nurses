import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface SPinnerProps {
  relative?: boolean;
  className?: string;
}

export const Spinner = ({ className, relative }: SPinnerProps) => {
  const classes = relative
    ? 'w-full h-full flex items-center justify-center'
    : 'fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2';
  return (
    <div className={classes}>
      <FontAwesomeIcon icon={faSpinner} className={`animate-spin ${className}`} />
    </div>
  );
};
