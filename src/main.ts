import * as cookieParser from "cookie-parser";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  var app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Enable validation and strip out any properties that are not in the DTO
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: process.env.FRONTEND_URL });
  await app.listen(8000);
}
bootstrap();
