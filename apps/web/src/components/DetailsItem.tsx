interface Details {
  title: string;
  text: string | undefined | string[];
}

export const DetailsItem: React.FC<Details> = ({ title, text }) => {
  return (
    <div className='sm:text-sm my-4'>
      <strong className='my-3 text-base'>{title}</strong>
      <p className='my-1 text-sm'>{Array.isArray(text) ? text.join(', ') : text}</p>
    </div>
  );
};
