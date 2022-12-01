import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Time {
  @Prop({ type: Number, required: true, min: 0, max: 24 })
  hour: number;

  @Prop({ type: Number, required: true, min: 0, max: 60 })
  minute: number;

  @Prop({ type: String, required: true, enum: ["AM", "PM"] })
  meridiem: string;
}

export var timeSchema = SchemaFactory.createForClass(Time);
