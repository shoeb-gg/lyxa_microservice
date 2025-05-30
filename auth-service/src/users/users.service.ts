import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { UserEntity } from 'src/entities/user.entity';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(getModelToken(User.name))
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userModel.create({ ...createUserDto });
  }

  async findAndVerifyUser(credentials: LoginDto): Promise<boolean> {
    const user: UserEntity | null = await this.userModel.findOne({
      email: credentials.email,
    });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password === credentials.password) {
      return true;
    } else {
      throw new Error('Invalid password');
    }

    // return await this.userModel.create({ ...createUserDto });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
