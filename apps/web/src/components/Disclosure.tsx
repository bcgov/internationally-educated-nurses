import { Disclosure as HeadlessDisclosure, Transition } from '@headlessui/react';
import chevronUp from '@assets/img/chevron_up.svg';

interface DisclosureProps {
  buttonText: React.ReactNode;
  content: React.ReactNode;
  shouldExpand?: boolean;
  wasOfferAccepted?: boolean;
}

export const Disclosure: React.FC<DisclosureProps> = ({
  buttonText,
  content,
  shouldExpand,
  wasOfferAccepted,
}) => {
  return (
    <HeadlessDisclosure defaultOpen={shouldExpand}>
      {({ open }) => (
        <div className='border border-gray-200 rounded'>
          <HeadlessDisclosure.Button
            className={`${
              wasOfferAccepted ? 'bg-bcGreenHiredContainer' : 'bg-bcBlueBar'
            } rounded-b-none flex justify-between w-full py-2`}
          >
            <img
              src={chevronUp.src}
              alt='expand'
              className={`ml-4 my-auto ${
                !open ? 'transform rotate-180 duration-300' : 'duration-300'
              }`}
            />
            {buttonText}
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
