import { isEmail } from "class-validator";
import { Document, SchemaTypes } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

/**
 * @remark Since fields such as email are not required, they can be set to
 * unique: true. There uniqueness has to be handled by the application.
 */
@Schema({ timestamps: true })
export class User extends Document {
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
  passwordResetTokenExpires?: Date;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  active: boolean;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  verified: boolean;

  @Prop({ type: SchemaTypes.String, select: false })
  verificationToken?: string;

  @Prop({ type: SchemaTypes.Date, select: false })
  verificationTokenExpires?: Date;
}

export var UserSchema = SchemaFactory.createForClass(User);
