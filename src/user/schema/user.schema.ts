import { verify } from "argon2";
import { isEmail } from "class-validator";
import { createHash, randomBytes } from "crypto";
import { Document } from "mongoose";
import { generate } from "randomstring";

import { JwtService } from "@nestjs/jwt";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { AccessTokenPayload, RefreshTokenPayload } from "../../auth/strategy";
import { UserRole } from "../../utils/user";
import { OAuthProvider, oauthProvidersSchema } from "./oauth-provider.schema";

@Schema({ timestamps: true })
export class User extends Document {
  constructor() {
    super();
  }

  // =====================================
  // Fields
  // =====================================

  /**
   * Making sure user has an email is work of the front-end
   * using endpoints in the back-end. This is because while using
   * OAuth, Twitter & Facebook users may not have an email, so email
   * can't be set to required
   */
  @Prop({ type: String, valaidate: [isEmail, "Invalid email"] })
  email?: string;

  /** Users signed up with OAuth won't have a password */
  @Prop({ type: String, select: false })
  passwordDigest?: string;

  @Prop({ type: String, select: false })
  passwordResetToken?: string;

  @Prop({
    type: Date,
    select: false,
    validate: [{ validator: dateShouldBeInFuture, message: "Invalid date" }],
  })
  passwordResetTokenExpiresAt?: Date;

  /** Is account active OR not */
  @Prop({ type: Boolean, required: true, default: false })
  active: boolean;

  @Prop({ type: Boolean, required: true, default: false })
  banned: boolean;

  @Prop({ type: Boolean, required: true, default: false })
  verified: boolean;

  @Prop({ type: String, select: false })
  verificationToken?: string;

  @Prop({
    type: Date,
    select: false,
    validate: [{ validator: dateShouldBeInFuture, message: "Invalid date" }],
  })
  verificationTokenExpiresAt?: Date;

  @Prop({ type: [oauthProvidersSchema], required: true, default: [] })
  oauthProviders: OAuthProvider[];

  @Prop({
    type: [String],
    required: true,
    default: [UserRole.BASE],
    enum: UserRole,
  })
  roles: UserRole[];

  @Prop({
    type: String,
    required: true,
    default: function createId() {
      var id = generate({ length: 16 });
      id = "acc_" + id;
      return id;
    },
  })
  userId: string;

  @Prop({ type: String, select: false })
  stripeCustomerId?: string;

  // =====================================
  // Instance Methods
  // =====================================

  generateVerificationToken!: () => string;
  generatePasswordResetToken!: () => string;
  verifyPassword!: (password: string) => Promise<boolean>;
  getAccessToken!: (jwt: JwtService) => string;
  getRefreshToken!: (jwt: JwtService) => string;
}

export var userSchema = SchemaFactory.createForClass(User);

// =====================================
// Instance Methods
// =====================================

/**
 * Generate a random token, hash it and set it as verification token
 * along with its expiry date
 *
 * @returns generated token
 */
userSchema.methods.generateVerificationToken = function createToken(): string {
  var token = randomBytes(32).toString("hex");
  this.verificationToken = createHash("sha256").update(token).digest("hex");
  this.verificationTokenExpiresAt = new Date(Date.now() + 5 + 60 + 1000); // 5m
  return token;
};

/**
 * Generate a random token, hash it and set it as verification token
 * along with its expiry date
 *
 * @returns generated token
 */
userSchema.methods.generatePasswordResetToken = function createToken(): string {
  var token = randomBytes(32).toString("hex");
  this.passwordResetToken = createHash("sha256").update(token).digest("hex");
  this.passwordResetTokenExpiresAt = new Date(Date.now() + 5 + 60 + 1000); // 5m
  return token;
};

userSchema.methods.verifyPassword = async function (
  pwd: string,
): Promise<boolean> {
  return await verify(this.passwordDigest, pwd);
};

userSchema.methods.getAccessToken = function (jwt: JwtService): string {
  var payload: AccessTokenPayload = { email: this.email };
  return jwt.sign(payload, {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

userSchema.methods.getRefreshToken = function (jwt: JwtService): string {
  var payload: RefreshTokenPayload = { _id: this._id, email: this.email };
  return jwt.sign(payload, {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

// =====================================
// Utilities
// =====================================

export function dateShouldBeInFuture(v: Date) {
  return v > new Date(Date.now());
}
