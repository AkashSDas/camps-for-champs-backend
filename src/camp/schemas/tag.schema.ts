import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum TagCode {
  WEATHER = "weather",
  PRICE = "price",
  LOCATION = "location",
  HIGHLIGHT = "highlight",
}

@Schema({ _id: false })
export class Tag {
  @Prop({ type: String, required: true, trim: true })
  emoji: string;

  @Prop({ type: String, required: true, trim: true, max: 16 })
  name: string;

  @Prop({ type: [String], required: true, default: [], enum: TagCode })
  codes: TagCode[];
}

export var tagSchema = SchemaFactory.createForClass(Tag);
