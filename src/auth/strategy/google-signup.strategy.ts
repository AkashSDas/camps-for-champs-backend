import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { AvailableOAuthProvider } from "src/user/schema/oauth-provider.schema";
import { UserRepository } from "src/user/user.repository";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class GoogleSignupStrategy extends PassportStrategy(
  Strategy,
  "google-signup",
) {
  constructor(private repository: UserRepository) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      passReqToCallback: true,
      scope: ["email", "profile"],
    });
  }

  async validate(
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    var { email, sub, email_verified } = profile._json;
    var user = await this.repository.get({ email });

    // login user if account already exists
    if (user) return done(null, user);

    // Signup the user
    try {
      let verified =
        typeof email_verified == "boolean"
          ? email_verified
          : email_verified == "true"
          ? true
          : false;

      let newUser = await this.repository.create({
        email: email,
        verified,
        active: verified,
        oauthProviders: [{ sid: sub, provider: AvailableOAuthProvider.GOOGLE }],
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
}
