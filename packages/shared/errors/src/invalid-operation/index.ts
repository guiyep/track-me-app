export class InvalidOperation extends Error {
  readonly type: 'InvalidOperation';
  message: string;

  constructor({ message }: { message: string }) {
    super();
    this.message = message;
  }
}
