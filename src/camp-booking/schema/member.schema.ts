import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum CampMemberType {
  ADULT = "adult",
  CHILD = "child",
  PET = "pet",
}

@Schema({ _id: false })
export class CampMember {
  @Prop({ type: String, enum: CampMemberType, required: true })
  memberType: CampMemberType;

  @Prop({ type: Number, required: true, min: 1 })
  amount: number;
}

export var CampMemberSchema = SchemaFactory.createForClass(CampMember);
