import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BadRequestException } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import {
  accessTokenStub,
  refreshTokenStub,
  userDtoStub,
  userStub,
} from "./test/stubs";

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

  // =====================================
  // Signup
  // =====================================

  describe("email signup", () => {
    it("with successful signup it should return user, access token & have a refresh token in res.headers", async () => {
      let response = await controller.emailAndPasswordSignup(
        res,
        userDtoStub(),
      );

      expect(response.user).toBeDefined();
      expect(response.user).toEqual(userStub());
      expect(response.accessToken).toEqual(accessTokenStub());
      expect(res.headers).toMatchObject({ refreshToken: refreshTokenStub() });
    });

    it("with user already exists error it should throw an error", async () => {
      jest
        .spyOn(service, "emailAndPasswordSignup")
        .mockImplementationOnce(async () => {
          return {
            user: null,
            refreshToken: null,
            accessToken: null,
            error: Error("User already exists"),
          };
        });

      await expect(() =>
        controller.emailAndPasswordSignup(res, userDtoStub()),
      ).rejects.toThrow(new BadRequestException("User already exists"));
    });
  });
});
