import { SubmissionPayloadDTO } from '@ehpr/common';

export class SubmissionRO {
  id!: number;
  version!: number;
  payload!: SubmissionPayloadDTO;
}
