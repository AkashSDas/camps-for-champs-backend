import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { TestingModule } from "./testing/testing.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),

    // Add your modules here
    TestingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
