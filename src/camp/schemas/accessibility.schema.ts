import { SchemaTypes } from "mongoose";
import { User } from "src/user/schemas";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Review {
  @Prop({ type: Number, required: true, min: 0, max: 5 })
  rating: number;

  @Prop({ type: String, required: true, trim: true })
  comment: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: User;

  @Prop({ type: Date, immutable: true, default: Date.now })
  ratedOn: Date;
}

export var reviewSchema = SchemaFactory.createForClass(Review);
