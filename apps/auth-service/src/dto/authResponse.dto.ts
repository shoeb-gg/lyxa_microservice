import { UserEntity } from '../entities/user.entity';

export type AuthResponse = UserEntity & {
  access_token: string;
};
