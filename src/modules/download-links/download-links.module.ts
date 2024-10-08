import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DOWNLOAD_LINKS_SCHEMA_TOKEN } from './download-links.const';
import { DownloadLinksSchema } from './schemas/download-links.schema';
import { DownloadLinksService } from './download-links.service';
import { DownloadController } from './download.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DOWNLOAD_LINKS_SCHEMA_TOKEN, schema: DownloadLinksSchema },
    ]),
  ],
  controllers: [DownloadController],
  providers: [DownloadLinksService],
  exports: [DownloadLinksService],
})
export class DownloadLinksModule {}
