import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshTokenGuard } from "./guard";
// eslint-disable-next-line prettier/prettier
import { AccessTokenStrategy, GoogleLoginStrategy, GoogleSignupStrategy } from "./strategy";

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenGuard,
    GoogleSignupStrategy,
    GoogleLoginStrategy,
  ],
})
export class AuthModule {}
