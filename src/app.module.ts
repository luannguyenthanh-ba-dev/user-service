import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDBModule } from './databases/mongodb/mongodb.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { EmailsModule } from './modules/emails/emails.module';

@Module({
  imports: [
    MongoDBModule,
    UsersModule,
    AuthModule,
    ClientsModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
