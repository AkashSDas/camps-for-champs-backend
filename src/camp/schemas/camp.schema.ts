import { Document } from "mongoose";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// eslint-disable-next-line prettier/prettier
import { Activity, activitySchema, CancellationPolicy, cancellationPolicySchema, Image, imageSchema, locationSchema, Review, reviewSchema, Tag, tagSchema, Time, timeSchema } from "./";

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

@Schema({ timestamps: true })
export class Camp extends Document {
  @Prop({ type: String, required: true, max: 128, unique: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, max: 4096, trim: true })
  description: string;

  @Prop({
    type: [String],
    required: true,
    default: [CampAccessibilityType.ROAD],
  })
  accessibilities: CampAccessibilityType[];

  @Prop({ type: String, required: true, enum: Amenity, default: [] })
  amenities: Amenity[];

  @Prop({ type: locationSchema, required: true })
  location: Location;

  @Prop({ type: [activitySchema], required: true, default: [] })
  activities: Activity[];

  @Prop({ type: timeSchema, required: true })
  checkInTime: Time;

  @Prop({ type: timeSchema, required: true })
  checkOutTime: Time;

  @Prop({ type: cancellationPolicySchema, required: true })
  cancellationPolicy: CancellationPolicy;

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
}

export var camp = SchemaFactory.createForClass(Camp);
