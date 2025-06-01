import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/interfaces/IUserRepsitory';
import { PrismaService } from '../prisma.service';
import { RoleVO } from 'src/domain/value-objects/role.vo';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(user: User): Promise<User> {
    try {
      const created = await this.prisma.user.create({
        data: {
          id: user.getId(),
          phone: user.getPhone(),
          name: user.getName(),
          role: user.getRole().getValue(),
          firebaseUid: user.getFirebaseUid() || null,
          isVerified: user.getIsVerified(),
        },
      });

      return new User(
        created.id,
        created.phone,
        created.name,
        RoleVO.create(created.role),
        created.firebaseUid ?? '',
        created.isVerified,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpExceptionError(
            MESSAGES.PHONE_ALREADY_EXISTS,
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpExceptionError(
        MESSAGES.FAILED_CREATE_USER,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) return null;
    return new User(
      user.id,
      user.phone,
      user.name,
      RoleVO.create(user.role),
      user.firebaseUid ?? '',
      user.isVerified,
    );
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.phone,
      user.name,
      RoleVO.create(user.role),
      user.firebaseUid || '',
      user.isVerified,
    );
  }

  // async findUserByEmail(email: string): Promise<User | null> {
  //   const user = await this.prisma.user.findUnique({ where: { email } });
  //   if (!user) return null;
  //   return new User(
  //     user.id,
  //     user.phone,
  //     user.name,
  //     RoleVO.create(user.role),
  //     user.firebaseUid ?? '',
  //     user.isVerified,
  //   );
  // }
}
