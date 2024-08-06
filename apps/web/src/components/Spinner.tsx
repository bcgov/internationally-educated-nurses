import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

interface SpinnerProps {
  relative?: boolean;
  className?: string;
  size?: SizeProp;
}

export const Spinner = ({ className, relative, size }: SpinnerProps) => {
  const classes = relative
    ? 'w-full h-full flex items-center justify-center'
    : 'fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2';
  return (
    <div className={classes}>
      <FontAwesomeIcon
        icon={faSpinner}
        fixedWidth
        className={`animate-spin ${className}`}
        size={size}
      />
    </div>
  );
};
