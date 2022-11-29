import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SampleService {
  private secretKey: string;

  constructor(config: ConfigService) {
    this.secretKey = config.get("TEST_STRING");
  }

  getHello(): string {
    return "⛺️ Camps for Champs";
  }

  getHelloJson() {
    return { message: "⛺️ Camps for Champs" };
  }

  getSecretKey() {
    return { key: this.secretKey };
  }
}
