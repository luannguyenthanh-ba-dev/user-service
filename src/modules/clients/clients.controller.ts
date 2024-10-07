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

@ApiTags('Clients')
@Controller('v1/clients')
export class ClientsController {
  private logger: Logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

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
    let client: any;
    if (existClient) {
      this.logger.warn(`Already existed client: ${data.email}`);
      client = await this.clientsService.updateOne({ email: data.email }, data);
    } else {
      client = await this.clientsService.create(data);
    }

    if (client) {
      // Create download link and send mail to client:
      // Create download link
      //
      // Send mail to client
      //
    }
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
