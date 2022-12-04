import { Document, SchemaTypes } from "mongoose";
// eslint-disable-next-line prettier/prettier
import { Activity, activitySchema, Camp, Time, timeSchema } from "src/camp/schemas";
import { User } from "src/user/schemas";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { CampMember, CampMemberSchema } from "./member.schema";

export enum CampBookingStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  FULFILLED = "fulfilled",
}

@Schema({ timestamps: true })
export class CampBooking extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Camp.name, required: true })
  camp: string;

  @Prop({ type: timeSchema, required: true })
  checkInTime: Time;

  @Prop({ type: timeSchema, required: true })
  checkOutTime: Time;

  @Prop({ type: [activitySchema], required: true })
  activities: Activity[];

  @Prop({
    type: [CampMemberSchema],
    required: true,
    validate: [
      {
        validator: function (v: unknown) {
          if (Array.isArray(v)) return v.length > 0;
          return false;
        },
        message: "At least one guest is required.",
      },
    ],
  })
  members: CampMember[];

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: Number, required: true, min: 1 })
  campUnit: number;

  @Prop({
    type: String,
    enum: CampBookingStatus,
    default: CampBookingStatus.PENDING,
  })
  status: CampBookingStatus;
}

export var CampBookingSchema = SchemaFactory.createForClass(CampBooking);
