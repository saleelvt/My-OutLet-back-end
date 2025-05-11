import { User } from '../entities/user.entity';

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  findUserByPhone(phone: string): Promise<User | null>;
}
