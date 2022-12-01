export class CampBooking extends Document {
  camp: string;
  user: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: { adult: number; child: number; pet: number };
  campUnits: number;
  amount: number;
  status: "fulfilled" | "cancelled" | "pending";
  orderValue: "high" | "low" | "medium"; // depends on the type of camp and etc
}
