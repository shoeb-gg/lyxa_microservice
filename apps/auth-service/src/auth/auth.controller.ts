import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { UserEntity } from '../entities/user.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResponseDto } from 'libs/common/dto/response.dto';
import { AuthResponse } from '../dto/authResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() credentials: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(credentials);
  }

  @MessagePattern('auth.validate-token')
  async validateToken(
    @Payload() token: string,
  ): Promise<ResponseDto<UserEntity>> {
    return await this.authService.validateToken(token);
  }
}
