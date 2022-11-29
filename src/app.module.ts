import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { SampleModule } from "./sample/sample.module";

@Module({
  imports: [SampleModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
