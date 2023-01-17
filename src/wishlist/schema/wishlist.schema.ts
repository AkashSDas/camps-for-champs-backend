import { Types } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Camp } from "../../camp/schema";
import { User } from "../../user/schema";

@Schema({ timestamps: true })
export class Wishlist extends Document {
  constructor() {
    super();
  }

  // =====================================
  // Fields
  // =====================================

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Camp.name, required: true })
  camp: Types.ObjectId;
}

export var wishlistSchema = SchemaFactory.createForClass(Wishlist);
