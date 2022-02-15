import { Mailable } from './mail-base.mailable';
import { MailTemplate } from '../enums/mail-template.enum';
import { Recipient } from '../types/recipient';

export class ConfirmationMailable extends Mailable<Record<string, unknown>> {
  public subject = 'Emergency Health Provider Registry - Confirmation of Form Submission';
  public readonly template = MailTemplate.CONFIRMATION;

  constructor(
    public readonly recipient: Recipient,
    public readonly context: Record<string, unknown> | null = null,
  ) {
    super(recipient, context);
  }
}
