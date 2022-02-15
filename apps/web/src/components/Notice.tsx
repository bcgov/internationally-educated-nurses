export const Notice: React.FC = ({ children }) => {
  return (
    <div className='border-l-10 border-bcBluePrimary p-6 pb-5 md:pb-6 mb-5 bg-bcLightBackground text-left flex items-center'>
      {children}
    </div>
  );
};
