import * as argon from "argon2";

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "./schemas";
import { UserRepository } from "./user.repository";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: function (repository: UserRepository) {
          var schema = UserSchema;

          // PRE HOOK
          schema.pre("save", async function preMongooseSave(next) {
            // If password is modified then hash it
            if (this.isModified("password")) {
              this.password = await argon.hash(this.password);
            }

            // Validate email uniqueness (could add other field which needs to be unique)
            if (this.isModified("email")) {
              let query = [];
              if (this.isModified("email")) query.push({ email: this.email });
              let exists = await repository.exists({ $or: query });
              if (exists) return next(new Error("Duplicate"));
            }

            return next();
          });

          // POST HOOK
          schema.post("save", function handleDuplicateError(err, user, next) {
            // Handle error due to violation of unique fields
            if (err instanceof Error && err.message == "Duplicate") {
              return next(new Error("Email already exists"));
            }

            if (err.name === "MongoError" && err.code === 11000) {
              return next(new Error("Duplicate fields"));
            }

            return next();
          });

          return schema;
        },
      },
    ]),
  ],
})
export class UserModule {}
