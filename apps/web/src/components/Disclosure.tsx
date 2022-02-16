import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure as HeadlessDisclosure } from '@headlessui/react';
import classnames from 'classnames';

interface DisclosureProps {
  buttonText: React.ReactNode;
  content: React.ReactNode;
}

export const Disclosure: React.FC<DisclosureProps> = ({ buttonText, content }) => {
  return (
    <HeadlessDisclosure>
      {({ open }) => (
        <>
          <HeadlessDisclosure.Button className={'flex justify-between items-center w-full'}>
            {buttonText}
            <FontAwesomeIcon
              icon={faChevronDown}
              className={classnames('text-gray-500 mr-5 h-5', { 'transform rotate-180': open })}
            />
          </HeadlessDisclosure.Button>
          <HeadlessDisclosure.Panel className='text-gray-500'>{content}</HeadlessDisclosure.Panel>
        </>
      )}
    </HeadlessDisclosure>
  );
};
