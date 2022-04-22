import { Disclosure as HeadlessDisclosure, Transition } from '@headlessui/react';
import plusIcon from '@assets/img/plus.svg';
import minusIcon from '@assets/img/minus.svg';

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
            className={'bg-bcBlueBar rounded-b-none flex justify-between w-full py-2'}
          >
            {buttonText}

            <img src={open ? minusIcon.src : plusIcon.src} alt='expand' className='mr-5 mt-2' />
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
