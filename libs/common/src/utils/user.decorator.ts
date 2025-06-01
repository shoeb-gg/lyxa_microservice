import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const UserID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest().user.data;

    if (!request.userInfo || !('_id' in request.userInfo)) {
      throw new UnauthorizedException('User ID not found in request');
    }

    const userId = String(request.userInfo._id);

    return userId;
  },
);
