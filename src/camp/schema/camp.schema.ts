import { Accessibility, Amenity, CampStatus } from "../../utils/camp";
import { dateShouldBeInFuture, User } from "../../user/schema";
import { Document, Types } from "mongoose";
import { generate } from "randomstring";
import { Image, imageSchema } from "./image.schema";
import { isURL } from "class-validator";
import { Location, locationSchema } from "./location.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import {
  CancellationPolicy,
  cancellationPolicySchema,
} from "./cancellation-policy.schema";

@Schema({ timestamps: true })
export class Camp extends Document {
  constructor() {
    super();
  }

  // =====================================
  // Fields
  // =====================================

  @Prop({ type: String, maxlength: 128, trim: true })
  name?: string;

  @Prop({ type: String, maxlength: 4096, trim: true })
  about?: string;

  @Prop({ type: [String], required: true, default: [], enum: Accessibility })
  accessibilities: Accessibility[];

  @Prop({ type: [String], required: true, default: [], enum: Amenity })
  amenities: Amenity[];

  @Prop({ type: locationSchema, index: "2dsphere" })
  location?: Location;

  @Prop({ type: String, maxlength: 128, trim: true })
  address?: string;

  @Prop({ tyep: String, validate: [isURL, "Invalid URL"] })
  googleMapURL?: string;

  @Prop({ type: [imageSchema], required: true, default: [] })
  images: Image[];

  @Prop({ type: Number, min: 0 })
  price?: number;

  @Prop({ type: Number, min: 0 })
  campLimit?: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: CampStatus,
    default: CampStatus.DRAFT,
  })
  status: CampStatus;

  @Prop({
    type: Date,
    validate: [{ validator: dateShouldBeInFuture, message: "Invalid date" }],
  })
  startDate?: Date;

  @Prop({
    type: Date,
    validate: [{ validator: dateShouldBeInFuture, message: "Invalid date" }],
  })
  endDate?: Date;

  @Prop({ type: cancellationPolicySchema })
  cancellationPolicy?: CancellationPolicy;

  @Prop({
    type: String,
    required: true,
    default: function createId() {
      var id = generate({ length: 16 });
      id = "camp_" + id;
      return id;
    },
  })
  campId: string;

  @Prop({ type: Number, default: 0, min: 0, required: true })
  bookings: number;
}

export var campSchema = SchemaFactory.createForClass(Camp);
