export class InvalidOperation extends Error {
  readonly type: 'InvalidOperation';
  readonly errorNumber: 400;
  message: string;

  constructor({ message }: { message: string }) {
    super();
    this.message = message;
  }
}
