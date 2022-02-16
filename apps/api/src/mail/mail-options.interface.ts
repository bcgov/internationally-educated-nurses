/**
 * MailOptions
 * Interface for what to pass into CHES
 */
export interface MailOptions {
  readonly to: string | string[];

  readonly from: string;

  readonly subject: string;

  readonly body: string;
}
