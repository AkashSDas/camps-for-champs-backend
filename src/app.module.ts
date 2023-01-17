import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "./auth/auth.module";
import { CampModule } from "./camp/camp.module";
import { CloudinaryProvider } from "./cloudinary.provider";
import { TestingModule } from "./testing/testing.module";
import { UserModule } from "./user/user.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { ModuleController } from './module/module.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URL),

    // Add your modules here
    TestingModule,
    UserModule,
    AuthModule,
    CampModule,
    WishlistModule,
  ],
  controllers: [ModuleController],
  providers: [CloudinaryProvider],
})
export class AppModule {}
