import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import {
  AccessTokenStrategy,
  GoogleLoginStrategy,
  GoogleSignupStrategy,
  RefreshTokenStrategy,
} from "./strategy";

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleSignupStrategy,
    GoogleLoginStrategy,
  ],
})
export class AuthModule {}
