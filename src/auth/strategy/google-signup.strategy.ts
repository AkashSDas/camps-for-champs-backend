import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { UserRepository } from "src/user/user.repository";
import { OAuthProvider } from "src/utils/auth.util";

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
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    var { email, sub, email_verified, picture } = profile._json;
    var user = await this.repository.getUser({ email });
    if (user) return done(null, user); // login user

    // Signup the user
    try {
      let verified =
        typeof email_verified == "boolean"
          ? email_verified
          : email_verified == "true"
          ? true
          : false;

      let newUser = await this.repository.createUser({
        email: email,
        verified,
        profileImage: { id: "google", URL: picture },
        active: verified,
        oauthProviders: [{ id: sub, provider: OAuthProvider.GOOGLE }],
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
}
