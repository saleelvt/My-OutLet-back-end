import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpExceptionError extends HttpException {
  constructor(
    public readonly message: string,
    public readonly statusCode: HttpStatus,
  ) {
    super({ message }, statusCode);
  }
}
