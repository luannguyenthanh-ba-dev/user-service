import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { DownloadLinksService } from './download-links.service';
import { DownloadLinkGuard } from '../auth/guards/download-link.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { res as resps } from 'src/common/utils';
import { createReadStream } from 'fs';

@ApiTags('Downloads')
@Controller('v1/downloads')
export class DownloadController {
  private logger: Logger = new Logger(DownloadLinksService.name);
  constructor(private readonly downloadLinksService: DownloadLinksService) {}

  @UseGuards(DownloadLinkGuard)
  @Get(':client/:slug/:token')
  async download(
    @Param('client') client: string,
    @Param('slug') slug: string,
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    // Process download here
    const filePath = this.downloadLinksService.processDesPath();
    const zipFileStream = createReadStream(filePath);

    // Set the headers to inform the browser it's a downloadable file
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="ez-ai.zip"',
    });

    // Pipe the file stream directly to the response
    zipFileStream.pipe(res);
    try {
      const promise = new Promise((resolve, reject) => {
        zipFileStream.on('end', () => {
          resolve({ success: true });
        });

        zipFileStream.on('error', (err) => {
          reject({ success: false });
        });
      });
      const result: any = await promise;

      // If downloaded successfully -> remove download link
      if (result.success) {
        this.downloadLinksService.deleteOne({ client, slug, token });
      }
      res.status(HttpStatus.OK).end();
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error downloading the file' });
      throw new BadRequestException('Download fail!');
    } finally {
      this.logger.debug(`End download stream!`);
      zipFileStream.close();
    }
  }
}
