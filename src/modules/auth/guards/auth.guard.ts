import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends JwtAuthGuard('jwt') {
  private logger = new Logger();
  private readonly internalServiceAPIKey = process.env.INTERNAL_SERVICE_API_KEY;
  
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    this.logger.log(
      `Request to route: ${context.getClass().name}.${
        context.getHandler().name
      }`,
    );
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    const apiKey = request.headers['api-key'];
    // Note: When we use internal API Key we must accept cross call all feature and pass the role guard too!
    if (apiKey) {
      if (apiKey !== this.internalServiceAPIKey) {
        this.logger.error(
          'ERROR from AuthGuard: Unauthorized for internal service calling!',
        );
        throw new UnauthorizedException(
          'ERROR: Unauthorized for internal service calling!',
        );
      }
      return true;
    }

    if (!token) {
      this.logger.error('ERROR from AuthGuard: Not have user token!');
      throw new ForbiddenException('ERROR: Not have user token!');
    }

    // Handle JWT Strategy
    return super.canActivate(context);
  }
}
