import { AuthModule } from "./auth/auth.module";
import { BookingModule } from "./booking/booking.module";
import { CampModule } from "./camp/camp.module";
import { CloudinaryProvider } from "./cloudinary.provider";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentModule } from "./payment/payment.module";
import { TestingModule } from "./testing/testing.module";
import { UserModule } from "./user/user.module";
import { WishlistModule } from "./wishlist/wishlist.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),
    TestingModule,
    UserModule,
    AuthModule,
    CampModule,
    WishlistModule,
    BookingModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [CloudinaryProvider],
})
export class AppModule {}
