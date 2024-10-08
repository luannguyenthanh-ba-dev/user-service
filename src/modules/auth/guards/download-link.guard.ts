import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DownloadLinksService } from 'src/modules/download-links/download-links.service';

@Injectable()
export class DownloadLinkGuard implements CanActivate {
  constructor(private downloadLinksService: DownloadLinksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    const client = request.params['client'];
    const slug = request.params['slug'];
    // TODO: Handle download Token
    const existToken = await this.downloadLinksService.findOne({
      token,
      client,
      slug,
    });
    if (!existToken) {
      return false;
    }
    return true;
  }
}
