import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EMAILS_DOWNLOAD_SCHEMA } from './emails.const';
import { EmailsDownloadSchema } from './schemas/emails-download.schema';
import { EmailsService } from './emails.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EMAILS_DOWNLOAD_SCHEMA, schema: EmailsDownloadSchema },
    ]),
  ],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
