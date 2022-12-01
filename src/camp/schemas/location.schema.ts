import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum OperationalState {
  MAHARASHTRA = "maharashtra",
}

export enum OperationalCity {
  MUMBAI = "mumbai",
}

@Schema({ _id: false })
export class Location {
  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: String, required: true, enum: OperationalState })
  state: OperationalState;

  @Prop({ type: String, required: true, enum: OperationalCity })
  city: OperationalCity;

  @Prop({ type: String, required: true, trim: true, max: 512 })
  address: string;
}

export var locationSchema = SchemaFactory.createForClass(Location);
