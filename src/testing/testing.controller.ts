import { Controller, Get } from "@nestjs/common";

@Controller("/v2/testing")
export class TestingController {
  @Get("/test")
  test() {
    return { message: "Hello World!" };
  }
}
