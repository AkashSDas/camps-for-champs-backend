import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum ImageType {
  LOCATION = "location",
  FOOD = "food",
  ACTIVITY = "activity",
  ACCOMMODATION = "accommodation",
}

@Schema({ _id: false })
export class Image {
  @Prop({ type: String })
  id?: string;

  @Prop({ type: String, required: true })
  URL: string;

  @Prop({ type: String, trim: true, max: 128 })
  description?: string;

  @Prop({ type: String, required: true, enum: ImageType })
  type: ImageType;
}

export var imageSchema = SchemaFactory.createForClass(Image);
