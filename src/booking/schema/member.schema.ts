import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum GuestType {
  ADULT = "adult",
  CHILD = "child",
  PET = "pet",
}

@Schema({ _id: false })
export class Guest {
  @Prop({ type: String, enum: GuestType, required: true })
  type: GuestType;

  @Prop({ type: Number, required: true, min: 1 })
  count: number;
}

export var guestSchema = SchemaFactory.createForClass(Guest);
