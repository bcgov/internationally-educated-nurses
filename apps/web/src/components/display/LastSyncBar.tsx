import { Disclosure as HeadlessDisclosure, Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';

import chevronUp from '@assets/img/chevron_up_white.svg';
import { useGetLastSyncTime } from '@services';

export const LastSyncBar = () => {
  const router = useRouter();
  const lastSync = useGetLastSyncTime();
  dayjs.extend(tz);
  dayjs.extend(utc);

  const formatLastSyncTime = (time: string) => {
    if (!time) {
      return 'N/A';
    }

    return dayjs(time).tz('America/Vancouver').format('MMM D, YYYY h:mm A') + ' PST';
  };

  if (router.pathname === '/login') {
    return <></>;
  }

  return (
    <HeadlessDisclosure>
      {({ open }) => (
        <div className='w-full flex flex-row-reverse justify-center'>
          <div className='container flex w-full mx-6 xl:w-xl'>
            <div className='flex flex-grow w-full'>
              <div className='ml-auto h-16 filter drop-shadow-md'>
                <HeadlessDisclosure.Button
                  className={'bg-bcBlueLink text-white flex flex-row ml-auto px-4 py-2'}
                >
                  Last Sync
                  <img
                    src={chevronUp.src}
                    alt='expand'
                    className={`ml-2 ${
                      !open ? 'transform rotate-180 duration-300' : 'duration-300'
                    }`}
                  />
                </HeadlessDisclosure.Button>
                {lastSync && (
                  <Transition
                    enter='transition ease-in duration-500 transform'
                    enterFrom='opacity-0 '
                    enterTo='opacity-100 '
                    leave='transition ease duration-300 transform'
                    leaveFrom='opacity-100 '
                    leaveTo='opacity-0 '
                  >
                    <HeadlessDisclosure.Panel>
                      <div className='bg-white p-2'>
                        {formatLastSyncTime(lastSync[0]?.updated_date)}
                      </div>
                    </HeadlessDisclosure.Panel>
                  </Transition>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </HeadlessDisclosure>
  );
};
