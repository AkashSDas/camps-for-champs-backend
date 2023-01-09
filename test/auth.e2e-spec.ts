import { MongoMemoryServer } from "mongodb-memory-server";
import { Document, Model } from "mongoose";
import * as request from "supertest";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
// eslint-disable-next-line prettier/prettier
import { getModelToken, MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "../src/auth/auth.module";
import { User } from "../src/user/schema";
import { UserModule } from "../src/user/user.module";

let mongod: MongoMemoryServer;

function rootMongooseTestModule(opts: MongooseModuleOptions = {}) {
  return MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      let mongoUri = mongod.getUri();
      return { uri: mongoUri, ...opts };
    },
  });
}

async function closeMongodConnection() {
  if (mongod) await mongod.stop();
}

describe("/v2/auth", () => {
  let app: INestApplication;
  let userModel: Model<User & Document>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        rootMongooseTestModule(),
        AuthModule,
        UserModule,
      ],
    }).compile();

    userModel = module.get<Model<User & Document>>(getModelToken(User.name));
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await closeMongodConnection();
  });

  // =====================================
  // Signup
  // =====================================

  describe("email signup", () => {
    it("successful signup with valid data", async () => {
      let response = await request(app.getHttpServer())
        .post("/v2/auth/email-signup")
        .send({ email: "james@gmail.com", password: "testingTEST@123" });

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({
        user: { email: "james@gmail.com" },
      });

      expect(response.body).toMatchSnapshot({
        accessToken: expect.any(String),
        user: {
          ...response.body.user,
          _id: expect.any(String),
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });

      expect(
        response.headers["set-cookie"].find((cookie: string) =>
          cookie.includes("refreshToken"),
        ),
      ).toBeDefined();
    });

    describe("user already exists", () => {
      beforeEach(async () => {
        await userModel.create({
          email: "james@gmail.com",
          passwordDigest: "testingTEST@123",
        });
      });

      it("if user already then given an user exists error", async () => {
        let response = await request(app.getHttpServer())
          .post("/v2/auth/email-signup")
          .send({ email: "james@gmail.com", password: "testingTEST@123" });

        expect(response.status).toEqual(400);
        expect(response.body).toMatchSnapshot();
      });
    });
  });

  // =====================================
  // Login
  // =====================================

  describe("email login", () => {
    it("when user doesn't exists given a 404 response", async () => {
      let response = await request(app.getHttpServer())
        .post("/v2/auth/email-login")
        .send({ email: "james@gmail.com", password: "testingTEST@123" });

      expect(response.status).toEqual(404);
      expect(response.body).toMatchSnapshot();
    });

    describe("when user exists", () => {
      beforeEach(async () => {
        await userModel.create({
          email: "james@gmail.com",
          passwordDigest: "testingTEST@123",
        });
      });

      it.only("when user entered correct password then login the user", async () => {
        let response = await request(app.getHttpServer())
          .post("/v2/auth/email-login")
          .send({ email: "james@gmail.com", password: "testingTEST@123" });

        console.log(response.body);
        expect(response.status).toEqual(200);
        expect(response.body).toMatchSnapshot();

        expect(
          response.headers["set-cookie"].find((cookie: string) =>
            cookie.includes("refreshToken"),
          ),
        ).toBeDefined();
      });
    });
  });
});
