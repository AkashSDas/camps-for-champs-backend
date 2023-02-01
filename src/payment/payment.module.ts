import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { User, userSchema } from "../user/schema";
import { UserModule } from "../user/user.module";
import { UserRepository } from "../user/user.repository";

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, UserRepository],
})
export class PaymentModule {}
