import { HttpStatus } from '@nestjs/common';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CUSTOMER = 'CUSTOMER',
}

export class RoleVO {
  private constructor(private readonly value: Role) {}

  static create(value: string): RoleVO {
    if (!Object.values(Role).includes(value as Role)) {
      throw new HttpExceptionError(
        MESSAGES.INVALID_ROLE,
        HttpStatus.BAD_REQUEST,
      );
    }
    return new RoleVO(value as Role);
  }

  getValue(): Role {
    return this.value;
  }

  isCustomer(): boolean {
    return this.value === Role.CUSTOMER;
  }
}
