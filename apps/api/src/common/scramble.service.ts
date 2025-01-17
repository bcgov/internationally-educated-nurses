import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class ScrambleService {
  // Scramble a string by hashing it and then shuffling the hash, returning only the first 10 characters
  scrambleText(input: string | undefined): string {
    if (!input) {
      return '';
    }
    // Create a SHA-256 hash of the input string
    const hash = createHash('sha256').update(input).digest('hex');
    // Convert the hash into an array of characters
    const characters = hash.split('');
    // Scramble the array using crypto for better randomness
    for (let i = characters.length - 1; i > 0; i--) {
      let randomValue;
      do {
        randomValue = randomBytes(1)[0];
      } while (randomValue >= 256 - (256 % (i + 1)));
      const j = randomValue % (i + 1);
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    // Join the scrambled characters back into a string and return only the first 10 characters
    const scrambledHash = characters.join('').substring(0, 10);
    return scrambledHash;
  }

  // Scramble an email by shuffling the local part and domain, returning only the first 10 characters
  scrambleEmail(email: string | undefined): string {
    if (!email) {
      return '';
    }
    const [local, domain] = email.split('@');
    if (local && domain) {
      const scrambledLocal = this.scrambleText(local).substring(0, 5);
      const scrambledDomain = this.scrambleText(domain).substring(0, 5);
      return `${scrambledLocal}@${scrambledDomain}`;
    }
    return this.scrambleText(email).substring(0, 10); // In case email is malformed
  }

  // Scramble a phone number while keeping the format (e.g., keep dashes and parentheses)
  scramblePhone(phone: string | undefined): string {
    if (!phone) {
      return '';
    }
    return phone.replace(/\d/g, () => (randomBytes(1)[0] % 10).toString());
  }
}
