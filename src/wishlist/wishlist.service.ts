import { Types } from "mongoose";
import { CampRepository } from "src/camp/camp.repository";

import { Injectable } from "@nestjs/common";

import { WishlistRepository } from "./wishlist.repository";

@Injectable()
export class WishlistService {
  constructor(
    private repository: WishlistRepository,
    private campRepository: CampRepository,
  ) {}

  async getWishlistForUser(id: Types.ObjectId) {
    return await this.repository.find({ user: id });
  }

  async createWishlistForUser(userId: Types.ObjectId, campId: string) {
    // Check if the camp exists
    var campExists = await this.campRepository.exists({ campId });
    if (!campExists) return new Error("Camp not found");

    // Check if the wishlist already exists
    var exists = await this.repository.exists({
      user: userId,
      camp: campExists._id,
    });
    if (exists) return new Error("Wishlist already exists");

    // Create the wishlist
    return await this.repository.create({
      user: userId,
      camp: campExists._id,
    });
  }

  async removeWishlistForUser(userId: Types.ObjectId, campId: string) {
    // Check if the camp exists
    var campExists = await this.campRepository.exists({ campId });
    if (!campExists) return new Error("Camp not found");

    // Check if the wishlist exists
    return await this.repository.delete({
      user: userId,
      camp: campExists._id,
    });
  }
}
