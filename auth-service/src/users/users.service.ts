import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
    try {
      return await this.userModel.create({ ...createUserDto });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while Registration!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAndVerifyUser(credentials: LoginDto): Promise<UserEntity> {
    try {
      const user: UserEntity | null = await this.userModel
        .findOne({
          email: credentials.email,
        })
        .lean();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }

      if (user.password === credentials.password) {
        const { password, ...res } = user;
        return res;
      } else {
        throw new HttpException('Invalid password!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Server Error while Login!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
