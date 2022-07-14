import detailIcon from '@assets/img/details.svg';

export const DetailsHeader = () => {
  return (
    <div className='col-span-12 border-b mb-3'>
      <div className='flex flex-row align-bottom py-4 font-bold'>
        <img src={detailIcon.src} alt='detail icon' />
        <h2 className='ml-2 font-bold text-xl text-bcBluePrimary'>Details</h2>
      </div>
    </div>
  );
};
