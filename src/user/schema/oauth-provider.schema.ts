import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

enum AvailableOAuthProvider {
  GOOGLE = "google",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
}

@Schema()
export class OAuthProvider {
  @Prop({ type: String, required: true })
  sid: string;

  @Prop({ type: String, required: true, enum: AvailableOAuthProvider })
  provider: AvailableOAuthProvider;
}

export var oauthProvidersSchema = SchemaFactory.createForClass(OAuthProvider);
