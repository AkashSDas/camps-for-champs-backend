import * as morgan from "morgan";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  var app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors({ credentials: true, origin: process.env.FRONTEND_URL });

  // Enable validation and strip out any properties that are not in the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(morgan("dev"));

  await app.listen(process.env.PORT || 8000);
}

bootstrap();
