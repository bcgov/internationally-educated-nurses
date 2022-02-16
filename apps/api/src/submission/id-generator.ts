import { customRandom } from 'nanoid';

export const generateConfirmationId = () =>
  customRandom('0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ', 13, size => {
    return new Uint8Array(size).map(() => 256 * Math.random());
  })();
