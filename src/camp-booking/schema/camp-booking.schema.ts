import { SchemaTypes } from "mongoose";
// eslint-disable-next-line prettier/prettier
import { Activity, activitySchema, Camp, Time, timeSchema } from "src/camp/schemas";
import { User } from "src/user/schemas";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Guest, GuestSchema } from "./";

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

  @Prop({ type: timeSchema })
  checkInTime?: Time;

  @Prop({ type: timeSchema })
  checkOutTime?: Time;

  @Prop({ type: [activitySchema], required: true, default: [] })
  additionalActivities: Activity[];

  @Prop({
    type: [GuestSchema],
    required: true,
    default: [],
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
  guests: Guest[];

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
