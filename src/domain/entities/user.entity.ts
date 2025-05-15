import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { RoleVO } from '../value-objects/role.vo';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { HttpStatus } from '@nestjs/common';

export class User {
  constructor(
    public readonly id: string,
    public readonly phone: string,
    public readonly name: string,
    public readonly role: RoleVO,
    private readonly firebaseUid: string,
    private isVerified: boolean,
  ) {}

  static create(
    id: string,
    phone: string,
    name: string,
    role: string,
    firebaseUid: string,
    isVerified = false,
  ): User {
    if (!phone) {
      throw new HttpExceptionError(
        MESSAGES.PHONE_REQUIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!name) {
      throw new HttpExceptionError(
        MESSAGES.NAME_REQUIRED,
        HttpStatus.BAD_REQUEST,
      );
    }
    const roleVo = RoleVO.create(role);
    return new User(id, phone, name, roleVo, firebaseUid, isVerified);
  }

  getId(): string {
    return this.id;
  }

  getPhone(): string {
    return this.phone;
  }

  getName(): string {
    return this.name;
  }

  getRole(): RoleVO {
    return this.role;
  }

  getFirebaseUid(): string {
    return this.firebaseUid;
  }
  getIsVerified(): boolean {
    return this.isVerified;
  }
  verify(): void {
    this.isVerified = true;
  }
}
