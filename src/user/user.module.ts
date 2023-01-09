import { hash } from "argon2";

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, userSchema } from "./schema";
import { UserRepository } from "./user.repository";

var userFeatureAsync = {
  name: User.name,
  useFactory: function () {
    userSchema.pre("save", async function preMongooseSave(next) {
      // If password is modified then hash it
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
  providers: [UserRepository],
})
export class UserModule {}
