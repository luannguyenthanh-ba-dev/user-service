import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CLIENTS_SCHEMA_TOKEN } from './clients.const';
import { ClientsSchema } from './schemas/clients.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CLIENTS_SCHEMA_TOKEN, schema: ClientsSchema },
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
