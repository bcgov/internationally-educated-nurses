import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ButtonProps {
  onClick?: () => void;
  variant: keyof typeof buttonColor;
  loading?: boolean;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  forModal?: boolean;
}

export const buttonColor: Record<string, string> = {
  primary: `border-bcBluePrimary bg-bcBluePrimary text-white hover:bg-blue-800 focus:ring-blue-500`,
  secondary: `border-bcBluePrimary bg-white text-bcBluePrimary hover:bg-gray-100 focus:ring-blue-500`,
  outline: `border-gray-400 bg-white hover:bg-gray-100 focus:ring-blue-500`,
};

export const buttonBase = `w-auto inline-flex justify-center items-center rounded border-2 
                              shadow-sm px-4 py-2 text-xs sm:text-sm font-bold focus:outline-none
                              disabled:opacity-50
                              focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:text-sm`;

export const modalButtonBase = `inline-flex justify-center items-center rounded shadow-sm 
                              px-12 py-2 text-xs sm:text-sm font-bold focus:outline-none disabled:opacity-50
                              focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:text-sm`;

export const Button: React.FC<ButtonProps> = props => {
  const { variant, type, children, disabled, loading, forModal, onClick } = props;
  return (
    <button
      onClick={onClick}
      type={type}
      className={`
        ${buttonColor[variant]}
        ${forModal ? modalButtonBase : variant !== 'link' ? buttonBase : ''}
      `}
      disabled={disabled}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className='h-5 w-5 animate-spin anim' />
      ) : (
        children
      )}
    </button>
  );
};
