import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

/**
 * @reference https://www.mongodb.com/docs/manual/geospatial-queries/#geojson-objects
 */
@Schema({ _id: false })
export class Location {
  @Prop({ type: String, enum: ["Point"], required: true })
  type: "Point";

  /** coordinates - [latitude, longitude] */
  @Prop({ type: [Number], required: true })
  coordinates: number[];
}

export var locationSchema = SchemaFactory.createForClass(Location);
