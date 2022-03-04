import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { buttonBase, buttonColor, iconColor } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ButtonDropdown {
  title: string;
  icon: IconProp;
  variant: string; // variants: primary, secondary, outline
  leftPlacement?: false;
}

export const ButtonDropdown: React.FC<ButtonDropdown> = ({
  title,
  icon,
  children,
  variant,
  leftPlacement,
}) => {
  return (
    <>
      <Popover className='relative'>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'} m-2 px-5
                ${buttonColor[variant]} ${buttonBase}`}
            >
              {leftPlacement && (
                <FontAwesomeIcon icon={icon} className={`${iconColor[variant]} ml-2 h-3`} />
              )}
              <span className='p-1 text-xs'>{title}</span>
              {!leftPlacement && (
                <FontAwesomeIcon icon={icon} className={`${iconColor[variant]} ml-2 h-3`} />
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute w-max px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl'>
                <div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                  <div className='relative grid bg-white p-2 grid-cols-1'>{children}</div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};
