import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ClientsService } from 'src/modules/clients/clients.service';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(private clientsService: ClientsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    // TODO: Handle Captcha Token
    // const existCaptchaToken = await this.clientsService.findOneCaptchaToken(
    //   token,
    // );
    // if (!existCaptchaToken) {
    //     return false;
    // }
    return true;
  }
}
