import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { SampleModule } from "./sample/sample.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),
    SampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
