import { MongoMemoryServer } from "mongodb-memory-server";
import { Model } from "mongoose";

import { Test } from "@nestjs/testing";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

jest.mock("./user.service");

describe("UserController", () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    let moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    service = moduleRef.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
