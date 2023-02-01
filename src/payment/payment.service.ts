import Stripe from "stripe";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private userRepository: UserRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });
  }

  async getOrCreateCustomer(
    userId: Types.ObjectId,
    params?: Stripe.CustomerCreateParams,
  ) {
    try {
      let user = await this.userRepository.findOne({ _id: userId });

      // If user does not have a stripe customer id, create one
      if (!user.stripeCustomerId) {
        let customer = await this.stripe.customers.create({
          email: user.email,
          metadata: { mongodbId: user._id.toString() },
          ...params,
        });

        user.stripeCustomerId = customer.id;
        await user.save();
        return customer;
      }

      // If user has a stripe customer id, retrieve it
      return await this.stripe.customers.retrieve(user.stripeCustomerId);
    } catch (error) {
      return null;
    }
  }
}
