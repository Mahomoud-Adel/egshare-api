import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // You can inject Reflector here to handle public routes with an @IsPublic() decorator
    // if needed in the future to bypass this guard for certain endpoints.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      // Enhanced error handling to give a better message depending on token state
      const message = info instanceof Error ? info.message : 'Authentication failed';
      throw err || new UnauthorizedException(`Unauthorized: ${message}`);
    }
    
    return user;
  }
}
