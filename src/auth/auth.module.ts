import { UserModule } from "src/user/user.module";

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
// eslint-disable-next-line prettier/prettier
import { AccessTokenStrategy, GoogleLoginStrategy, GoogleSignupStrategy, RefreshTokenStrategy } from "./strategy";
import { FacebookLoginStrategy } from "./strategy/facebook-login.strategy";
import { FacebookSignupStrategy } from "./strategy/facebook-signup.strategy";

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleSignupStrategy,
    GoogleLoginStrategy,
    FacebookSignupStrategy,
    FacebookLoginStrategy,
  ],
})
export class AuthModule {}
