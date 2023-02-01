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

  /**
   * Get or create customer
   *
   * @param userId - User's mongoId
   */
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
        return customer as Stripe.Customer;
      }

      // If user has a stripe customer id, retrieve it
      return (await this.stripe.customers.retrieve(
        user.stripeCustomerId,
      )) as Stripe.Customer;
    } catch (error) {
      return null;
    }
  }

  /**
   * Returns all the payment sources associated to the user
   */
  async listPaymentMethod(userId: Types.ObjectId) {
    try {
      let customer = await this.getOrCreateCustomer(userId);
      return await this.stripe.paymentMethods.list({
        customer: customer.id,
        type: "card",
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Creates a SetupIntent used to save a credit card for latest user
   *
   * Process of saving a credit card on a customer account is very similar
   * to how the payment intent api works, instead of payment intent you
   * create a setup intent and only parameter it requires is the customer id
   */
  async createSetupIntent(userId: Types.ObjectId) {
    try {
      let customer = await this.getOrCreateCustomer(userId);
      return await this.stripe.setupIntents.create({
        customer: customer.id,
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Create a Payment Intent with a specific amount
   */
  async createPaymentIntent(
    userId: Types.ObjectId,
    amountToCharge: number,
    params?: Stripe.PaymentIntentCreateParams,
  ) {
    try {
      let customer = await this.getOrCreateCustomer(userId);
      return await this.stripe.paymentIntents.create({
        amount: amountToCharge,
        currency: "inr",
        customer: customer.id,
        receipt_email: customer.email,
        ...params,
      });
    } catch (error) {
      return null;
    }
  }

  async getInvoices(userId: Types.ObjectId) {
    try {
      let customer = await this.getOrCreateCustomer(userId);
      let invoices = await this.stripe.invoices.list({
        customer: customer.id,
        limit: 10,
      });

      return invoices;
    } catch (error) {
      return null;
    }
  }
}
