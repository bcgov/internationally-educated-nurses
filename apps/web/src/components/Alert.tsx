import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Alert: React.FC = ({ children }) => {
  return (
    <div className='bg-bcLightBlueBackground py-4  text-left flex items-center rounded'>
      <div className='px-5 text-bcBluePrimary'>
        <FontAwesomeIcon className='h-6' icon={faExclamationCircle}></FontAwesomeIcon>
      </div>
      <div className='text-bcBluePrimary'>{children}</div>
    </div>
  );
};
