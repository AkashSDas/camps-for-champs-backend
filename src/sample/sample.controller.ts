import { Body, Controller, Get, Post } from "@nestjs/common";

import { SampleDto } from "./dto";
import { SampleService } from "./sample.service";

@Controller("/v1/sample")
export class SampleController {
  constructor(private sampleService: SampleService) {}

  // Response is text/html depending on the data type
  @Get("/hello")
  getHello(): string {
    return this.sampleService.getHello();
  }

  // Response is application/json
  @Get("/hello-json")
  getHelloJson() {
    return this.sampleService.getHelloJson();
  }

  // Not a good way to do validation
  // @Post("/return-body")
  // returnBody(
  //   @Body("email") email: string,
  //   @Body("password", ParseIntPipe) password: number,
  // ) {
  //   return { email, password };
  // }

  @Post("/return-body")
  returnBody(@Body() dto: SampleDto) {
    return dto;
  }

  @Get("/secret-key")
  getSecretKey() {
    return this.sampleService.getSecretKey();
  }
}
