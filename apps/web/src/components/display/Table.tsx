export const Table: React.FC = () => {
  const sampleData = [
    { id: '1', name: 'Alice', phone: '+1 778-123-4567', email: 'alice@gov.ca' },
    { id: '2', name: 'Bob', phone: '+1 778-123-7654', email: 'bob@gov.ca' },
    { id: '3', name: 'Colin', phone: '+1 877-321-5321', email: 'colin@gov.ca' },
  ];
  return (
    <>
      <div className='grid grid-flow-row-dense grid-cols-4'>
        {sampleData.map((row: any) => {
          return (
            <>
              <div className='row-span-1 '>{row.id}</div>
              <div className='row-span-1'>{row.name}</div>
              <div className='row-span-1'>{row.phone}</div>
              <div className='row-span-1'>{row.email}</div>
            </>
          );
        })}
      </div>
    </>
  );
};
