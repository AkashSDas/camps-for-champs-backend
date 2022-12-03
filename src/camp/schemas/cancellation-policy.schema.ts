import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum CancellationPolicyType {
  FLEXIBLE = "flexible",
  MODERATE = "moderate",
  STRICT = "strict",
}

@Schema({ _id: false })
export class CancellationPolicy {
  @Prop({ type: String, required: true, enum: CancellationPolicyType })
  type: CancellationPolicyType;

  @Prop({ type: String, required: true, max: 512, trim: true })
  description: string;
}

export var cancellationPolicySchema =
  SchemaFactory.createForClass(CancellationPolicy);
