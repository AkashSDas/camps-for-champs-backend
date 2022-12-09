import { Request } from "express";
import { Profile, Strategy } from "passport-facebook";
import { UserRepository } from "src/user/user.repository";
import { OAuthProvider } from "src/utils/auth.util";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class FacebookLoginStrategy extends PassportStrategy(
  Strategy,
  "facebook-login",
) {
  constructor(private repository: UserRepository) {
    super({
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL_FOR_LOGIN,
      profileFields: ["id", "first_name", "displayName", "photos", "email"],
      passReqToCallback: true,
      includeEmail: true,
    });
  }

  async validate(
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    var { id } = profile._json;
    var user = await this.repository.getUser({
      oauthProviders: { $elemMatch: { id, provider: OAuthProvider.FACEBOOK } },
    });

    // If the user doesn't exists OR the user exists but the signup process isn't
    // completed yet
    if (!user || !user.email) {
      return done(null, null);
    }

    // Login the user
    return done(null, user);
  }
}
