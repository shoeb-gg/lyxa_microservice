import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from 'libs/common/dto/response.dto';
import { UserEntity } from '../entities/user.entity';
import { AuthResponse } from '../dto/authResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const user: UserEntity = await this.usersService.create(createUserDto);
    const { password, ...userInfo } = user;
    return {
      access_token: this.jwtService.sign({ name: user.name, id: user._id }),
      ...userInfo,
    };
  }

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const user: UserEntity =
      await this.usersService.findAndVerifyUser(credentials);

    const { password, ...userInfo } = user;

    return {
      access_token: this.jwtService.sign({ userInfo }),
      ...userInfo,
    };
  }

  async validateToken(token: string): Promise<ResponseDto<UserEntity>> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return {
        data: payload,
        success: true,
        message: 'Product Created Successfully!',
        status: HttpStatus.CREATED,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
