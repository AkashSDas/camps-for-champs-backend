import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { UserRepository } from "../../user/user.repository";

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(
  Strategy,
  "google-login",
) {
  constructor(private repository: UserRepository) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_LOGIN_CALLBACK_URL,
      scope: ["email", "profile"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    var { email } = profile._json;
    var user = await this.repository.get({ email });

    // If the user doesn't exists OR the user exists but the
    // signup process isn't completed yet
    if (!user || !user?.email) return done(null, null);

    // Log the user in
    return done(null, user);
  }
}
