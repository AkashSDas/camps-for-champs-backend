import { Camp } from "src/camp/schema";
import { dateShouldBeInFuture, User } from "src/user/schema";
import { Document, SchemaTypes, Types } from "mongoose";
import { Guest, guestSchema } from "./member.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Camp.name, required: true })
  camp: Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
    validate: [dateShouldBeInFuture, "Check-in date should be in the future"],
  })
  checkIn: Date;

  @Prop({
    type: Date,
    required: true,
    validate: [dateShouldBeInFuture, "Check-out date should be in the future"],
  })
  checkOut: Date;

  @Prop({
    type: [guestSchema],
    required: true,
    validate: [
      {
        validator: function checkForEmptyGuestsList(v: unknown) {
          if (Array.isArray(v)) return v.length > 0;
          return false;
        },
        message: "At least one guest is required",
      },
    ],
  })
  guests: Guest[];

  @Prop({
    type: String,
    enum: BookingStatus,
    default: BookingStatus.PENDING,
    required: true,
  })
  status: BookingStatus;

  @Prop({ type: Number, min: 0, required: true })
  amountCharged: number;

  @Prop({ type: Number, min: 0, required: true })
  campUnitsBooked: number;
}

export var bookingSchema = SchemaFactory.createForClass(Booking);
