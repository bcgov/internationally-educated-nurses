/**
 * NotificationType
 * The base class that notification types extend
 */

import { MailTemplate } from '../enums/mail-template.enum';
import { Recipient } from '../types/recipient';

export abstract class Mailable<Context = Record<string, unknown>> {
  // Notification Subject
  public abstract subject: string;

  // For now, because all of our notifications are mail, we have a mandatory MailTemplate
  // We may want to extend this type if we have different notifications
  public abstract template: MailTemplate;

  constructor(
    public readonly recipient: Recipient,
    public readonly context: Context | null = null,
  ) {}
}
