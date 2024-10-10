import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  NotAcceptableException,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { res, ROLES } from 'src/common/utils';
import { CreateNewClientDto, GetListClientsDto } from './dtos';
import { CaptchaGuard } from '../auth/guards/captcha.guard';
import { Auth } from '../auth/auth.decorator';
import { DownloadLinksService } from '../download-links/download-links.service';
import { EmailsService } from '../emails/emails.service';

@ApiTags('Clients')
@Controller('v1/clients')
export class ClientsController {
  private logger: Logger = new Logger(ClientsController.name);

  constructor(
    private readonly clientsService: ClientsService,
    private readonly downloadLinksService: DownloadLinksService,
    private readonly emailsService: EmailsService,
  ) {}

  /**
   * This API is used for both feature new Client and retry Client!
   * @param data
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(CaptchaGuard)
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success!',
    type: Object,
  })
  async createNewClient(@Body() data: CreateNewClientDto) {
    const existClient = await this.clientsService.findOne({
      email: data.email,
    });
    let client;
    if (existClient) {
      this.logger.warn(`Already existed client: ${data.email}`);
      client = await this.clientsService.updateOne({ email: data.email }, data);
    } else {
      client = await this.clientsService.create(data);
    }
    //
    // Create download link and send mail to client:
    const existDownloadLink = await this.downloadLinksService.findOne({
      client: client._id,
    });

    // Create download link
    let downloadLink;
    // If existed download link -> remove the old link -> create new link = retry session!
    this.logger.log(`Handle create download link for client: ${client.email}`);
    // Retry
    if (existDownloadLink) {
      // Retry after a minute
      if (Math.floor(Date.now() / 1000) - existDownloadLink.createdAt <= 60) {
        throw new NotAcceptableException(
          'We can only create a download link one time per minute for this client',
        );
      }
      // After a minute -> delete old download link
      await this.downloadLinksService.deleteOne({ client: client._id });
      // Create new download link
      downloadLink = await this.downloadLinksService.create({
        client: client._id,
      });
    } else {
      // First register
      downloadLink = await this.downloadLinksService.create({
        client: client._id,
      });
    }
    //
    // Send mail to client
    //
    this.logger.log(`Handle send download email for client: ${client.email}`);
    this.emailsService.sendEmailDownload(client, downloadLink.link);

    return res(HttpStatus.CREATED, { success: true });
  }

  @ApiBearerAuth()
  @Auth(ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success!',
    type: Object,
  })
  async getListClients(@Query() filters: GetListClientsDto) {
    const clients = await this.clientsService.findManyByFilters(filters);
    return clients;
  }
}
