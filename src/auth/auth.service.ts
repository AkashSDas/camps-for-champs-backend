import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserRepository } from "../user/user.repository";
import { sendVerificationEmail } from "../utils/mail.util";
import { SignupDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(private repository: UserRepository, private jwt: JwtService) {}

  // ================================
  // SIGNUP
  // ================================

  async signup(dto: SignupDto) {
    // Create new user and send verification email
    try {
      var user = await this.repository.createUser({
        email: dto.email,
        password: dto.password,
      });
      var success = await sendVerificationEmail(user);

      // remove password from response. This should come after sendVerificationEmail because
      // sendVerificationEmail does user.save() and if password is removed before that then
      // it would save it as undefined
      user.password = undefined;

      var message = success
        ? "Account created, verification email sent"
        : "Account created";
    } catch (error) {
      if (error instanceof Error && error.message == "Email already exists") {
        throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
      }
      throw error;
    }

    var user = await this.repository.getUser({ email: dto.email });
    var message = "login test";
    {
      let accessToken = user.accessToken(this.jwt);
      var response = { accessToken, user, message };
    }

    return response;
  }
}
