import { SubmissionPayloadDTO } from '@ien/common';

export class SubmissionRO {
  id!: number;
  version!: number;
  payload!: SubmissionPayloadDTO;
}
