import { UserModule } from "src/user/user.module";

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RefreshTokenGuard } from "./guard";
import { AccessTokenStrategy } from "./strategy";

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenGuard],
})
export class AuthModule {}
