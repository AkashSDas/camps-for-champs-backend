import * as cookieParser from "cookie-parser";
import * as fileUpload from "express-fileupload";
import * as morgan from "morgan";
import * as session from "express-session";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  var app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors({ credentials: true, origin: process.env.FRONTEND_URL });

  // Enable validation and strip out any properties that are not in the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(morgan("dev"));

  app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.COOKIE_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 5 * 60 * 1000, // 5 minutes
      },
    }),
  );

  await app.listen(process.env.PORT || 8000);
}

bootstrap();
