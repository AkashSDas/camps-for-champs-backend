import { Types } from "mongoose";
import { CampRepository } from "src/camp/camp.repository";

import { Injectable, NotFoundException } from "@nestjs/common";

import { CampWishlistRepository } from "./camp-wishlist.repository";

@Injectable()
export class CampWishlistService {
  constructor(
    private campWishlistRepository: CampWishlistRepository,
    private campRepository: CampRepository,
  ) {}

  async toggleCampWishlistStatus(userId: string, campId: string) {
    var campObjectId = new Types.ObjectId(campId);
    var userObjectId = new Types.ObjectId(userId);
    let exists = await this.campRepository.exists(campObjectId);
    if (!exists) throw new NotFoundException("Camp not found");

    var isWishlisted = await this.campWishlistRepository.exists(
      userObjectId,
      campObjectId,
    );

    if (isWishlisted) {
      await this.campWishlistRepository.delete(userObjectId, campObjectId);
      return { action: "removed" };
    } else {
      let wishlist = await this.campWishlistRepository.create(
        userObjectId,
        campObjectId,
      );

      return { action: "added", wishlist };
    }
  }

  async getUserWishlist(userId: string) {
    var userObjectId = new Types.ObjectId(userId);
    return await this.campWishlistRepository.getWithCamp(userObjectId);
  }
}
