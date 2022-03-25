import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure as HeadlessDisclosure, Transition } from '@headlessui/react';

interface DisclosureProps {
  buttonText: React.ReactNode;
  content: React.ReactNode;
}

export const Disclosure: React.FC<DisclosureProps> = ({ buttonText, content }) => {
  return (
    <HeadlessDisclosure>
      {({ open }) => (
        <div className='border border-gray-200 rounded'>
          <HeadlessDisclosure.Button
            className={'bg-blue-100 rounded-b-none flex justify-between w-full'}
          >
            {buttonText}
            <FontAwesomeIcon
              icon={open ? faMinusCircle : faPlusCircle}
              className='text-black mr-5 h-5 mt-2'
            />
          </HeadlessDisclosure.Button>
          <Transition
            enter='transition ease-in duration-500 transform'
            enterFrom='opacity-0 '
            enterTo='opacity-100 '
            leave='transition ease duration-300 transform'
            leaveFrom='opacity-100 '
            leaveTo='opacity-0 '
          >
            <HeadlessDisclosure.Panel>{content}</HeadlessDisclosure.Panel>
          </Transition>
        </div>
      )}
    </HeadlessDisclosure>
  );
};
