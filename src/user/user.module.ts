import { hash } from "argon2";

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, userSchema } from "./schema";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

var userFeatureAsync = {
  name: User.name,
  useFactory: function () {
    userSchema.pre("save", async function preMongooseSave(next) {
      // If password is modified then hash it
      // console.log(this.isNew, this.passwordDigest, this);

      // The second check is to prevent hashing the password twice (this occurs
      // only in testing). https://github.com/kpfromer/nestjs-typegoose/issues/61
      //
      // The gist of the issue is that during testing since beforeEach & afterEach
      // are used for loading creating & deleting model, jest's ts-node transpiler,
      // it loads user.model.ts twice causing the hook to be added twice
      //
      // Another way to solve this issue is instead of using beforeEach & afterEach
      // in the global scope in `auth.e2e-spec.ts`, use beforeAll & afterAll (in that
      // case all tests have to be updated)
      //
      // I've used the second way but I'm leaving this comment here for future reference
      // if (this.isModified("passwordDigest") && this.passwordDigest?.startsWith("$argon2id$") == false)
      if (this.isModified("passwordDigest")) {
        this.passwordDigest = await hash(this.passwordDigest);
      }

      // Validate email uniqueness (could add other field which needs to be unique)
      if (this.isModified("email")) {
        let query = [];
        if (this.isModified("email")) query.push({ email: this.email });
        let exists = await (this.constructor as any).exists({ $or: query });
        if (exists) return next(new Error("Duplicate user"));
      }

      return next();
    });

    userSchema.post("save", function handleDuplicateError(err, user, next) {
      // Handle error due to violation of unique fields
      if (err instanceof Error && err.message == "Duplicate user") {
        return next(new Error("Email already exists"));
      } else if (err.name == "MongoError" && err.code == 11000) {
        return next(new Error("Duplicate fields"));
      }

      next();
    });

    return userSchema;
  },
};

@Module({
  imports: [MongooseModule.forFeatureAsync([userFeatureAsync])],
  exports: [UserRepository],
  providers: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}
