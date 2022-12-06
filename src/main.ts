import * as cookieParser from "cookie-parser";
import * as fileUpload from "express-fileupload";
import * as morgan from "morgan";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  var app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Enable validation and strip out any properties that are not in the DTO
  app.enableCors({ credentials: true, origin: process.env.FRONTEND_URL });

  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

  var config = new DocumentBuilder()
    .setTitle("Camps for Champs")
    .setDescription("RESTful back-end for main operations of Camps for Champs")
    .setVersion("1.0")
    .addTag("camps")
    .build();
  var document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(5002);
}
bootstrap();
