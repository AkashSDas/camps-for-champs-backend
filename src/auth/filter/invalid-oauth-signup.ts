import { Response } from "express";

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from "@nestjs/common";

@Catch(UnauthorizedException)
export class InvalidOAuthLoginFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).redirect(`${process.env.OAUTH_LOGIN_FAILURE_REDIRECT_URL}?info=signup-invalid`);
  }
}
