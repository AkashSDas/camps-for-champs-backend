import { Document, Types } from "mongoose";
import { User } from "src/user/schemas";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// eslint-disable-next-line prettier/prettier
import { Activity, activitySchema, CancellationPolicy, cancellationPolicySchema, Image, imageSchema, locationSchema, Review, reviewSchema, Tag, tagSchema, timeSchema } from "./";
import { Location } from "./location.schema";
import { Time } from "./time.schema";

export enum CampAccessibilityType {
  ROAD = "road",
}

export enum Amenity {
  WIFI = "wifi",
  CHARGING_PORT = "charging_port",
  COVERED_AREA = "covered_area",
  ATTACHED_BATHROOM = "attached_bathroom",
  DRINKING_WATER = "drinking_water",
  PHONE_NETWORK = "phone_network",
  PET_FRIENDLY = "pet_friendly",
  AIR_CONDITIONING = "air_conditioning",
  PARKING = "parking",
  RESTAURANT = "restaurant",
  BAR = "bar",
  SWIMMING_POOL = "swimming_pool",
  SPA = "spa",
}

export enum CampStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

@Schema({ timestamps: true })
export class Camp extends Document {
  constructor() {
    super();
  }

  @Prop({ type: String, max: 128, trim: true })
  name?: string;

  @Prop({ type: String, max: 4096, trim: true })
  description?: string;

  @Prop({ type: [String], required: true, default: [] })
  accessibilities: CampAccessibilityType[];

  @Prop({ type: [String], required: true, enum: Amenity, default: [] })
  amenities: Amenity[];

  @Prop({ type: locationSchema })
  location?: Location;

  @Prop({ type: [activitySchema], required: true, default: [] })
  activities: Activity[];

  @Prop({ type: timeSchema })
  checkInTime?: Time;

  @Prop({ type: timeSchema })
  checkOutTime?: Time;

  @Prop({ type: cancellationPolicySchema })
  cancellationPolicy?: CancellationPolicy;

  @Prop({ type: [tagSchema], required: true, default: [] })
  tags: Tag[];

  @Prop({ type: [imageSchema], required: true, default: [] })
  images: Image[];

  @Prop({ type: [reviewSchema], required: true, default: [] })
  reviews: Review[];

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  price: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  campLimit: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: CampStatus,
    default: CampStatus.DRAFT,
  })
  status: CampStatus;
}

export var CampSchema = SchemaFactory.createForClass(Camp);
