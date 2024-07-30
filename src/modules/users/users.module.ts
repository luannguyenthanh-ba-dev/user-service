import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USERS_SCHEMA_TOKEN } from './users.const';
import { UsersSchema } from './schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USERS_SCHEMA_TOKEN, schema: UsersSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
