import React from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

export type onDropType = <T extends File>(
  acceptedFiles: T[],
  fileRejections: FileRejection[],
  event: DropEvent,
) => void;

export const Dropzone: React.FC<{ onDrop: onDropType }> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className='w-full'>
      <input
        className='w-full'
        {...getInputProps({
          accept: '.csv',
          multiple: false,
        })}
      />
      {
        <div
          className={`w-full h-32 border-dashed border-2 rounded-sm border-bcBlueLink flex flex-col items-center justify-center ${
            isDragActive ? 'bg-blue-100' : ''
          }`}
        >
          <FontAwesomeIcon icon={faCloudUploadAlt} className='text-bcBluePrimary h-10 w-10' />
          <p className='text-sm'>
            Drop your file here, or{' '}
            <span className='text-bcBlueLink underline cursor-pointer'>
              browse from your device
            </span>
          </p>
        </div>
      }
    </div>
  );
};
