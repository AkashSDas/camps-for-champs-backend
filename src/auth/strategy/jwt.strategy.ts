import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "src/user/user.repository";

import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService, private repository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("access_token"),
      ]),
      ignoreException: false,
      secretOrKey: config.get("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  /**
   * The return value from here will be appened to req.user for routes
   * that are guarded by AuthGuard('jwt')
   */
  async validate(_req, payload: { sub: string }) {
    var user = this.repository.getUser({ email: payload.sub });
    return user;
  }
}
