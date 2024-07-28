import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDBModule } from './databases/mongodb/mongodb.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [MongoDBModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
