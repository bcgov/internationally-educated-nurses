import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SubmissionEntity } from './entity/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmissionDTO, PersonalInformationDTO } from '@ehpr/common';
import { MailService } from 'src/mail/mail.service';
import { ConfirmationMailable } from 'src/mail/mailables/confirmation.mailable';
import { Recipient } from 'src/mail/types/recipient';
import { generateConfirmationId } from './id-generator';
import { AppLogger } from 'src/common/logger.service';

@Injectable()
export class SubmissionService {
  constructor(
    @Inject(Logger) private readonly logger: AppLogger,
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepository: Repository<SubmissionEntity>,
    @Inject(MailService)
    private readonly mailService: MailService,
  ) {}
  async saveSubmission(dto: SubmissionDTO): Promise<SubmissionEntity> {
    const confirmationId = generateConfirmationId();
    const newSubmission = this.submissionRepository.create({
      ...dto,
      confirmationId,
    } as Partial<SubmissionEntity>);
    const savedSubmission = await this.submissionRepository.save(newSubmission);
    this.logger.log(`Saved submission: ${savedSubmission.id}`, SubmissionService.name);

    return this.sendSubmissionConfirmation(savedSubmission);
  }

  private async sendSubmissionConfirmation(submission: SubmissionEntity) {
    const { payload } = submission;
    const { email } = payload.contactInformation;

    const mailable = new ConfirmationMailable({ email } as Recipient, {
      firstName: (payload.personalInformation as PersonalInformationDTO).firstName,
      confirmationId: this.convertIdToDashedId(submission.confirmationId),
    });

    this.logger.log(
      `Sending confirmation email for submission: ${submission.id}`,
      SubmissionService.name,
    );
    const mailResponse = await this.mailService.sendMailable(mailable);
    submission.chesId = mailResponse?.txId;
    submission = await this.submissionRepository.save(submission);
    this.logger.log(
      `Confirmation email sent for submission: ${submission.id}`,
      SubmissionService.name,
    );

    return submission;
  }

  private convertIdToDashedId(id: string): string {
    return (
      id.substring(0, 3) +
      '-' +
      id.substring(3, 6) +
      '-' +
      id.substring(6, 9) +
      '-' +
      id.substring(9)
    );
  }
}
