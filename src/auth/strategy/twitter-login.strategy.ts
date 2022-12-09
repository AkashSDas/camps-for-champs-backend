import { Request } from "express";
import { Profile, Strategy } from "passport-twitter";
import { UserRepository } from "src/user/user.repository";
import { OAuthProvider } from "src/utils/auth.util";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class TwitterLoginStrategy extends PassportStrategy(
  Strategy,
  "twitter-login",
) {
  constructor(private repository: UserRepository) {
    super({
      consumerKey: process.env.TWITTER_OAUTH_CLIENT_KEY,
      consumerSecret: process.env.TWITTER_OAUTH_CLIENT_KEY_SECRET,
      callbackURL: process.env.TWITTER_OAUTH_CALLBACK_URL_FOR_LOGIN,
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
      oauthProviders: {
        $elemMatch: { id: id, provider: OAuthProvider.TWITTER },
      },
    });

    // If the user doesn't exists OR the user exists but the signup process isn't
    // completed yet
    if (!user || !user.email) return done(null, null);

    // Login the user
    return done(null, user);
  }
}
