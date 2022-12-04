import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum ActivityType {
  TREKKING = "trekking",
  KAYAKING = "kayaking",
  OUTDOOR_GAMES = "outdoor_games",
  INDOOR_GAMES = "indoor_games",
  BIRD_WATCHING = "bird_watching",
  FISHING = "fishing",
}

@Schema({ _id: false })
export class Activity {
  @Prop({ type: String, required: true, enum: ActivityType })
  type: ActivityType;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  price: number;
}

export var activitySchema = SchemaFactory.createForClass(Activity);
