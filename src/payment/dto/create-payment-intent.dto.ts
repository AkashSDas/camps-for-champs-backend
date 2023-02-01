import { IsNumber, Min } from "class-validator";

export class CreatePaymentIntent {
  @IsNumber()
  @Min(0)
  amount: number;
}
