import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "./auth/auth.module";
import { CampBookingModule } from "./camp-booking/camp-booking.module";
import { CampWishlistModule } from "./camp-wishlist/camp-wishlist.module";
import { CampModule } from "./camp/camp.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),
    UserModule,
    AuthModule,
    CampModule,
    CampWishlistModule,
    CampBookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
