import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { FastifyRequest } from 'fastify';
import { firstValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';
import { UserEntity } from 'apps/auth-service/src/entities/user.entity';
import { ResponseDto } from 'libs/common/dto/response.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    const token = this.extractTokenFromHeader(request);

    try {
      const validationResult: ResponseDto<UserEntity> = await firstValueFrom(
        this.authClient.send('auth.validate-token', token),
      );

      if (!validationResult.success) {
        throw new UnauthorizedException('Invalid token');
      }

      request['user'] = validationResult;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader || typeof authHeader !== 'string') return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
