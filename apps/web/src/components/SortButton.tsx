import sortIcon from '@assets/img/sort.svg';

export interface SortButtonProps {
  label: string;
  sortKey: string;
  onChange: (key: string) => void;
}

export const SortButton = ({ label, sortKey, onChange }: SortButtonProps) => {
  return (
    <div className='flex align-middle justify-between'>
      <span>{label}</span>
      <button id={`sort-by-${sortKey}`} onClick={() => onChange(sortKey)}>
        <img src={sortIcon.src} alt='sort' />
      </button>
    </div>
  );
};
