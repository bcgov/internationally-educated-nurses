import React from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

export const Dropzone = (props: DropzoneOptions) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone(props);

  return (
    <div {...getRootProps()} className='w-full'>
      <input className='w-full' {...getInputProps()} aria-label='file-upload-dropzone' />
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
