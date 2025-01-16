import { Injectable } from '@nestjs/common';

@Injectable()
export class ScrambleService {
  // Scramble a string by shuffling its characters
  scrambleText(input: string | undefined): string {
    if (!input) {
      return '';
    }
    return input
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  // Scramble an email by shuffling the local part and domain
  scrambleEmail(email: string | undefined): string {
    if (!email) {
      return '';
    }
    const [local, domain] = email.split('@');
    if (local && domain) {
      return `${this.scrambleText(local)}@${this.scrambleText(domain)}`;
    }
    return this.scrambleText(email); // In case email is malformed
  }

  // Scramble a phone number while keeping the format (e.g., keep dashes and parentheses)
  scramblePhone(phone: string | undefined): string {
    if (!phone) {
      return '';
    }
    return phone.replace(/\d/g, () => Math.floor(Math.random() * 10).toString());
  }
}
