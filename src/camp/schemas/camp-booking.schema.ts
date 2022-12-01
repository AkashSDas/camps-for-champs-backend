import { SchemaTypes } from "mongoose";
import { User } from "src/user/schemas";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Camp } from "./";

export enum CampBookingStatus {
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

@Schema({ _id: false })
class CampGuest {
  @Prop({ type: Number, min: 0, required: true })
  adult: number;

  @Prop({ type: Number, min: 0, required: true })
  child: number;

  @Prop({ type: Number, min: 0, required: true })
  pet: number;
}

var campGuestSchema = SchemaFactory.createForClass(CampGuest);

export class CampBooking extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: Camp.name, required: true })
  camp: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: string;

  @Prop({ type: Date, required: true })
  checkInDate: Date;

  @Prop({ type: Date, required: true })
  checkOutDate: Date;

  @Prop({ type: [campGuestSchema], required: true, default: [] })
  guests: CampGuest[];

  @Prop({ type: Number, default: 0, min: 0, required: true })
  campUnits: number;

  @Prop({ type: Number, default: 0, min: 0, required: true })
  amount: number;

  @Prop({
    type: String,
    required: true,
    enum: CampBookingStatus,
    default: CampBookingStatus.PENDING,
  })
  status: CampBookingStatus;
}
