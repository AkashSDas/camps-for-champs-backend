import { Request } from "express";
import { Profile, Strategy } from "passport-facebook";
import { UserRepository } from "src/user/user.repository";
import { OAuthProvider } from "src/utils/auth.util";

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class FacebookSignupStrategy extends PassportStrategy(
  Strategy,
  "facebook-signup",
) {
  constructor(private repository: UserRepository) {
    super({
      clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
      profileFields: ["id", "first_name", "displayName", "photos", "email"],
      passReqToCallback: true,
      includeEmail: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    var { email, id, picture } = profile._json;
    var user = await this.repository.getUser({
      oauthProviders: { $elemMatch: { id, provider: OAuthProvider.FACEBOOK } },
    });
    if (user) return done(null, user); // login the user

    // Signup the user
    try {
      let newUser = await this.repository.createUser({
        email: email ?? undefined,
        verified: email ? true : false,
        profileImage: { id: "facebook", URL: picture.data.url },
        active: email ? true : false,
        oauthProviders: [{ id: id, provider: OAuthProvider.FACEBOOK }],
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
}
