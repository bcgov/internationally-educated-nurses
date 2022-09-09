interface LabelProps {
  htmlFor: string;
}

export const Label: React.FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className='block text-bcGray text-base font-bold'>
      {children}
    </label>
  );
};
