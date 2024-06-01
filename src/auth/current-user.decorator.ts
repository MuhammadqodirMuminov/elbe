import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';

export const getCurrentUserByContext = (
    context: ExecutionContext,
): UserDocument => {
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest().user;
    }
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) =>
        getCurrentUserByContext(context),
);
