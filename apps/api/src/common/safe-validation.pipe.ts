/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  ValidationPipe,
  ArgumentMetadata,
  ValidationPipeOptions,
} from '@nestjs/common';

@Injectable()
export class SafeValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  private isBinaryData(obj: any): boolean {
    return obj instanceof Buffer || obj instanceof Uint8Array || obj instanceof ArrayBuffer;
  }

  private isObject(obj: any): boolean {
    return (
      obj !== null && typeof obj === 'object' && !Array.isArray(obj) && !this.isBinaryData(obj)
    );
  }

  private cleanObject(obj: any): any {
    if (this.isBinaryData(obj)) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanObject(item));
    }

    if (this.isObject(obj)) {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Skip properties that are binary data to prevent whitelist issues
        if (!this.isBinaryData(value)) {
          cleaned[key] = this.cleanObject(value);
        }
      }
      return cleaned;
    }

    return obj;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && value) {
      // Clean the object to remove binary data before validation
      const cleanedValue = this.cleanObject(value);

      // Use the parent transform with cleaned data
      return super.transform(cleanedValue, metadata);
    }

    return super.transform(value, metadata);
  }
}
