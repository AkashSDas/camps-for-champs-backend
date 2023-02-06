import { AccessTokenGuard } from "../auth/guard";
import { CreatePaymentIntent } from "./dto";
import { PaymentService } from "./payment.service";
import { Request } from "express";
import { User } from "../user/schema";
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

@Controller("/v2/payment")
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Get("/cards")
  @UseGuards(AccessTokenGuard)
  async getUserPaymentCards(@Req() req: Request) {
    var cards = await this.service.listPaymentMethod((req.user as User)._id);

    if (!cards) {
      throw new InternalServerErrorException(
        "Failed to retrieve payment cards",
      );
    }

    return { cards };
  }

  @Post("/card")
  @UseGuards(AccessTokenGuard)
  async saveCardForUser(@Req() req: Request) {
    var setupIntent = await this.service.createSetupIntent(
      (req.user as User)._id,
    );

    if (!setupIntent) {
      throw new InternalServerErrorException("Failed to create setup intent");
    }

    return { setupIntent };
  }

  @Post("/charge")
  @UseGuards(AccessTokenGuard)
  async createPaymentIntent(
    @Req() req: Request,
    @Body() dto: CreatePaymentIntent,
  ) {
    var paymentIntent = await this.service.createPaymentIntent(
      (req.user as User)._id,
      dto.amount,
    );

    if (!paymentIntent) {
      throw new InternalServerErrorException("Failed to create payment intent");
    }

    var invoice = await this.service.createInvoice((req.user as User)._id);
    return { paymentIntent, invoice };
  }

  @Get("/invoices")
  @UseGuards(AccessTokenGuard)
  async getInvoices(@Req() req: Request) {
    var invoices = await this.service.getInvoices((req.user as User)._id);

    if (!invoices) {
      throw new InternalServerErrorException("Failed to create payment intent");
    }

    return { invoices };
  }
}
