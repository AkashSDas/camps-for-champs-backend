import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
// eslint-disable-next-line prettier/prettier
import { accessTokenStub, refreshTokenStub, userDtoStub, userStub } from "./test/stubs";

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
    it("with successful signup it should return user, access token & have a refresh token in res.headers", async () => {
      var response = await controller.emailAndPasswordSignup(
        res,
        userDtoStub(),
      );

      expect(response.user).toBeDefined();
      expect(response.user).toEqual(userStub());
      expect(response.accessToken).toEqual(accessTokenStub());
      expect(res.headers).toMatchObject({ refreshToken: refreshTokenStub() });
    });
  });
});
