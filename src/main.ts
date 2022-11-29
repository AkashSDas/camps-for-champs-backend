import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  var app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");

  // Enable validation and strip out any properties that are not in the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(8000);
}
bootstrap();
