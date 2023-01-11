import { MongoMemoryServer } from "mongodb-memory-server";
import { connect, Connection, Document, Model } from "mongoose";
import * as request from "supertest";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
// eslint-disable-next-line prettier/prettier
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "../src/auth/auth.module";
import { User } from "../src/user/schema";
import { UserModule } from "../src/user/user.module";

describe("auth", () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User & Document>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(uri),
        AuthModule,
        UserModule,
      ],
      providers: [{ provide: getModelToken(User.name), useValue: userModel }],
    }).compile();

    userModel = module.get<Model<User & Document>>(getModelToken(User.name));
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  // =====================================
  // Signup
  // =====================================

  describe("email-signup", () => {
    afterEach(async () => {
      await userModel.deleteMany({});
    });

    describe("when user doesn't exists", () => {
      it("then successfully do a signup", async () => {
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
    });

    describe("when user already exists", () => {
      beforeEach(async () => {
        await userModel.create({
          email: "james@gmail.com",
          passwordDigest: "testingTEST@123",
        });
      });

      it("then given an 400 error", async () => {
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

  describe("email-login", () => {
    describe("when user doesn't exists", () => {
      it("then give a 404 response", async () => {
        let response = await request(app.getHttpServer())
          .post("/v2/auth/email-login")
          .send({ email: "james@gmail.com", password: "testingTEST@123" });

        expect(response.status).toEqual(404);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe("when user exists", () => {
      beforeEach(async () => {
        await userModel.create({
          email: "james@gmail.com",
          passwordDigest: "testingTEST@123",
        });
      });

      it("then successfully login", async () => {
        let response = await request(app.getHttpServer())
          .post("/v2/auth/email-login")
          .send({ email: "james@gmail.com", password: "testingTEST@123" });

        expect(response.status).toEqual(200);

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
    });
  });
});
