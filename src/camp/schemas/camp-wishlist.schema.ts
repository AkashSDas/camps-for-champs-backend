import { Document, SchemaTypes } from "mongoose";
import { User } from "src/user/schemas";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Camp } from "./camp.schema";

@Schema()
export class CampWishlist extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  user: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Camp.name, required: true })
  camp: string;
}

export var campWishlist = SchemaFactory.createForClass(CampWishlist);
