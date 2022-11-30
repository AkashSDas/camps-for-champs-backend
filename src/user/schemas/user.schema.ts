import * as argon from "argon2";
import { isEmail } from "class-validator";
import { createHash, randomBytes } from "crypto";
import { Document, SchemaTypes } from "mongoose";
import { AccessTokenPayload, RefreshTokenPayload } from "src/auth/strategy";

import { JwtService } from "@nestjs/jwt";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

/**
 * @remark Since fields such as email are not required, they can be set to
 * unique: true. There uniqueness has to be handled by the application.
 */
@Schema({ timestamps: true })
export class User extends Document {
  constructor() {
    super();
  }

  @Prop({ type: SchemaTypes.String, max: 64, trim: true })
  firstName?: string;

  @Prop({ type: SchemaTypes.String, max: 64, trim: true })
  lastName?: string;

  @Prop({ type: SchemaTypes.String, validate: [isEmail, "Invalid"] })
  email?: string;

  @Prop({ type: SchemaTypes.String, select: false })
  password?: string;

  @Prop({ type: SchemaTypes.String, select: false })
  passwordResetToken?: string;

  @Prop({ type: SchemaTypes.Date, select: false })
  passwordResetTokenExpiresAt?: Date;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  active: boolean;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  verified: boolean;

  @Prop({ type: SchemaTypes.String, select: false })
  verificationToken?: string;

  @Prop({ type: SchemaTypes.Date, select: false })
  verificationTokenExpiresAt?: Date;

  // ============================
  // INSTANCE METHODS
  // ============================

  generateVerificationToken!: () => string;
  accessToken!: (jwt: JwtService) => string;
  refreshToken!: (jwt: JwtService) => string;
  verifyPassword: (password: string) => Promise<boolean>;
}

export var UserSchema = SchemaFactory.createForClass(User);

// ============================
// INSTANCE METHODS
// ============================

/**
 * Generate a random token, hash it and set it as verification token
 * along with its expiry date (10min from now)
 *
 * @returns the generated token
 */
UserSchema.methods.generateVerificationToken = function (): string {
  var token = randomBytes(32).toString("hex");
  this.verificationToken = createHash("sha256").update(token).digest("hex");
  this.verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10m
  return token;
};

/** Genereate access token for JWT authentication. Short duration */
UserSchema.methods.accessToken = function (jwt: JwtService): string {
  var payload: AccessTokenPayload = { email: this.email };
  return jwt.sign(payload, {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

/** Genereate refresh token for JWT authentication. Long duration */
UserSchema.methods.refreshToken = function (jwt: JwtService): string {
  var payload: RefreshTokenPayload = { _id: this._id, email: this.email };
  return jwt.sign(payload, {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

/**
 * @param pwd Password to be compared
 * @returns true if password matches, false otherwise
 */
UserSchema.methods.verifyPassword = function (pwd: string): Promise<boolean> {
  return argon.verify(this.password, pwd);
};
