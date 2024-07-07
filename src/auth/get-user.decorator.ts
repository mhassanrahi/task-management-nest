import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  return req.user;
});
