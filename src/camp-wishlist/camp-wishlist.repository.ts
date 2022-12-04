import { Model, Types } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CampWishlist } from "./schema";

@Injectable()
export class CampWishlistRepository {
  constructor(
    @InjectModel(CampWishlist.name) private wishlist: Model<CampWishlist>,
  ) {}

  async create(userId: Types.ObjectId, campId: Types.ObjectId) {
    return await this.wishlist.create({ user: userId, camp: campId });
  }

  exists(userId: Types.ObjectId, campId: Types.ObjectId) {
    return this.wishlist.exists({ user: userId, camp: campId });
  }

  delete(userId: Types.ObjectId, campId: Types.ObjectId) {
    return this.wishlist.deleteOne({ user: userId, camp: campId });
  }

  getWithCamp(userId: Types.ObjectId) {
    return this.wishlist.find({ user: userId }).populate("camp");
  }
}
