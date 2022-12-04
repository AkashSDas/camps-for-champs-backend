import { Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CampWishlist } from "./schema";

@Injectable()
export class CampWishlistRepository {
  constructor(
    @InjectModel(CampWishlist.name) private wishlist: Model<CampWishlist>,
  ) {}
}
