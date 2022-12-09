import { Request } from "express";
import { Profile, Strategy } from "passport-twitter";
import { UserRepository } from "src/user/user.repository";
import { OAuthProvider } from "src/utils/auth.util";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class TwitterSignupStrategy extends PassportStrategy(
  Strategy,
  "twitter-signup",
) {
  constructor(private repository: UserRepository) {
    super({
      consumerKey: process.env.TWITTER_OAUTH_CLIENT_KEY,
      consumerSecret: process.env.TWITTER_OAUTH_CLIENT_KEY_SECRET,
      callbackURL: process.env.TWITTER_OAUTH_CALLBACK_URL,
      passReqToCallback: true,
      includeEmail: true,
    });
  }

  async validate(
    _req: Request,
    _token: string,
    _tokenSecret: string,
    profile: Profile,
    done: any,
  ) {
    var { id, email, profile_image_url } = profile._json;
    var user = await this.repository.getUser({
      oauthProviders: {
        $elemMatch: { id: id, provider: OAuthProvider.TWITTER },
      },
    });
    if (user) return done(null, user); // login the user

    // Signup the user
    try {
      let newUser = await this.repository.createUser({
        email: email ?? undefined,
        verified: email ? true : false,
        profileImage: profile_image_url
          ? { id: "twitter", URL: profile_image_url }
          : null,
        active: email ? true : false,
        oauthProviders: [{ id: id, provider: OAuthProvider.TWITTER }],
      });
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
}
