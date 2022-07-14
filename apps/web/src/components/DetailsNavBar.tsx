import { useRouter } from 'next/router';

export interface DetailsNavBarProps {
  parent: string;
  label: string;
}

export const DetailsNavBar = ({ parent, label }: DetailsNavBarProps) => {
  const router = useRouter();

  return (
    <div className='relative w-1/2 text-xs mt-4 mb-5 font-bold'>
      <button onClick={() => router.back()}>
        <a className='text-bcGray hover:text-bcBlueLink hover:underline'>{parent}</a>
      </button>
      <span className='mx-3'>&gt;</span>
      <span className='text-bcBlueLink'>{label}</span>
    </div>
  );
};
