import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HTMLProps } from 'react';
import classNames from 'classnames';

export interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  onClick?: () => void;
  variant: keyof typeof buttonColor;
  loading?: boolean;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  forModal?: boolean;
  className?: string;
}

export const buttonColor: Record<string, string> = {
  primary: ` bg-bcBluePrimary text-white hover:bg-blue-800 focus:ring-blue-500`,
  secondary: `bg-white text-bcBluePrimary hover:bg-gray-100 focus:ring-blue-500`,
  outline: `bg-white hover:bg-gray-100 focus:ring-blue-500`,
  danger: `bg-white text-red-600 border-red-600 hover:bg-red-100 focus:ring-red-500`,
};

export const buttonBase = `h-[38px] inline-flex justify-center items-center rounded border-2 border-bcBluePrimary
                              shadow-sm px-4 py-2 text-xs sm:text-sm font-bold focus:outline-none
                              disabled:opacity-50
                              focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:text-sm`;

export const modalButtonBase = `inline-flex justify-center items-center rounded shadow-sm border-2 border-bcBluePrimary
                              px-16 py-2 text-xs sm:text-sm font-bold focus:outline-none disabled:opacity-50
                              focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:text-sm`;

export const Button = (props: ButtonProps) => {
  const { variant, type, children, disabled, loading, forModal, className, onClick, ...moreProps } =
    props;

  const classes = classNames(
    className,
    buttonColor[variant],
    forModal ? modalButtonBase : buttonBase,
  );

  return (
    <button onClick={onClick} type={type} className={classes} disabled={disabled} {...moreProps}>
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className='h-5 w-5 animate-spin anim' />
      ) : (
        children
      )}
    </button>
  );
};
