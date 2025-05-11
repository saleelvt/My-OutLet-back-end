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
          created_at: user.getCreatedAt(),
        },
      });

      return new User(
        created.id,
        created.phone,
        created.name,
        RoleVO.create(created.role),
        created.created_at,
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
      user.created_at,
    );
  }
}
