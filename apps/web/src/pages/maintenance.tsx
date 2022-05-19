import { Footer, Header } from '@components';
import maintenanceIcon from '@assets/img/maintenance.svg';

export const Maintenance = () => {
  return (
    <div className='h-full flex flex-col'>
      <Header />
      <main className='flex flex-grow w-full justify-center'>
        <div className='container'>
          <div className='absolute mx-auto left-0 right-0 top-1/4 text-center'>
            <div className='flex flex-col items-center justify-center rounded py-6 px-24'>
              <img src={maintenanceIcon.src} alt='maintenance' className='text-center' />
              <h1 className='font-bold text-4xl my-6'>Under Maintenance</h1>
              <div className='text-center mb-7'>
                <p>The system is currently under schedule maintenance.</p>
                <p>We apologize for the inconvenience.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
