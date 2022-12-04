import { Prop, SchemaFactory } from "@nestjs/mongoose";

enum CampGuestType {
  ADULT = "adult",
  CHILD = "child",
  PET = "pet",
}

export class Guest {
  @Prop({ type: String, required: true, enum: CampGuestType })
  type: CampGuestType;

  @Prop({ type: Number, required: true, min: 0 })
  count: number;
}

export var GuestSchema = SchemaFactory.createForClass(Guest);
