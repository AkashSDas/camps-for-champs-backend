import { MongoMemoryServer } from "mongodb-memory-server";
import { Document, Model } from "mongoose";
import * as request from "supertest";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
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

describe("/v2/user", () => {
  let app: INestApplication;
  let userModel: Model<User & Document>;
  let jwt: JwtService;
  let user: User & Document;
  let accessToken: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        rootMongooseTestModule(),
        JwtModule.register({}),
        AuthModule,
        UserModule,
      ],
    }).compile();

    userModel = module.get<Model<User & Document>>(getModelToken(User.name));
    jwt = module.get<JwtService>(JwtService);
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => {
    await closeMongodConnection();
  });

  beforeEach(async () => {
    user = await userModel.create({
      email: "james@gmail.com",
      passwordDigest: "testingTEST@123",
    });
    accessToken = user.getAccessToken(jwt);
  });

  describe("me", () => {
    it("if user is logged in then return that user info", async () => {
      let response = await request(app.getHttpServer())
        .get("/v2/user/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({
        user: { email: "james@gmail.com" },
      });

      expect(response.body).toMatchSnapshot({
        user: {
          ...response.body.user,
          _id: expect.any(String),
          userId: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    describe("if the user is not logged in", () => {
      beforeEach(() => {
        accessToken = null;
      });

      it("then return 401", async () => {
        let response = await request(app.getHttpServer()).get("/v2/user/me");
        expect(response.status).toEqual(401);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe("if the user doesn't exists", () => {
      beforeEach(() => {
        user = null;
      });

      it("then return 404", async () => {
        let response = await request(app.getHttpServer()).get("/v2/user/me");
        expect(response.status).toEqual(404);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
