import { Module } from "@nestjs/common";

import { TestingController } from "./testing.controller";

@Module({
  controllers: [TestingController],
})
export class TestingModule {}
