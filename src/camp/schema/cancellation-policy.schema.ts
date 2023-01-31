import { PolicyType } from "../../utils/camp";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class CancellationPolicy {
  @Prop({ type: String, required: true, enum: PolicyType })
  type: PolicyType;

  @Prop({ type: String, required: true, max: 512, trim: true })
  description: string;
}

export var cancellationPolicySchema =
  SchemaFactory.createForClass(CancellationPolicy);
