import { FileRejection, DropEvent } from 'react-dropzone';

export type onDropType = <T extends File>(
  acceptedFiles: T[],
  fileRejections: FileRejection[],
  event: DropEvent,
) => void;
