import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { userDtoStub } from "./test/stubs";

jest.mock("./auth.service");

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;

  let req, res;
  let next = jest.fn();

  beforeEach(async () => {
    let moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    service = moduleRef.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      query: {},
      headers: {},
      data: null,
      json(payload) {
        this.data = JSON.stringify(payload);
      },
      cookie(name, value, options) {
        this.headers[name] = value;
      },
    };

    next.mockReset();
  });

  describe("signup with email", () => {
    it("with right data & unique email create & login the user", async () => {
      var response = await controller.emailAndPasswordSignup(
        res,
        userDtoStub(),
      );

      console.log(response);
    });
  });
});
