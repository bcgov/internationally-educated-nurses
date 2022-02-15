import { HttpStatus } from '@nestjs/common';
import { GenericError } from 'src/common/generic-exception';

export const MailError = {
  FAILED_TO_SEND_EMAIL: {
    errorType: 'FAILED_TO_SEND_EMAIL',
    errorMessage: 'Failed to send email',
    httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
  } as GenericError,

  FAILED_TO_GET_CHES_TOKEN: {
    errorType: 'FAILED_TO_GET_CHES_TOKEN',
    errorMessage: 'Failed to get CHES token',
    httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
  } as GenericError,
};
