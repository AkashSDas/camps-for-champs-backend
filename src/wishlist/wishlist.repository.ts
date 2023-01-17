import { FilterQuery, Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Wishlist } from "./schema";

@Injectable()
export class WishlistRepository {
  constructor(@InjectModel(Wishlist.name) private model: Model<Wishlist>) {}

  find(filter: FilterQuery<Wishlist>) {
    return this.model.find(filter);
  }

  create(data: Partial<Wishlist>) {
    return this.model.create(data);
  }

  delete(filter: FilterQuery<Wishlist>) {
    return this.model.deleteOne(filter);
  }

  exists(filter: FilterQuery<Wishlist>) {
    return this.model.exists(filter);
  }
}
