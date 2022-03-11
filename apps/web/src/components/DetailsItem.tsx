interface Details {
  title: string;
  text: string;
}

export const DetailsItem: React.FC<Details> = ({ title, text }) => {
  return (
    <div className='text-sm my-4'>
      <strong className='my-3'>{title}</strong>
      <p className='my-1'>{text}</p>
    </div>
  );
};
