import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { TestingModule } from "./testing/testing.module";
import { UserModule } from "./user/user.module";
import { ServiceController } from './auth/service/service.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),

    // Add your modules here
    TestingModule,
    UserModule,
    AuthModule,
  ],
  controllers: [ServiceController, AuthController],
  providers: [AuthService],
})
export class AppModule {}
