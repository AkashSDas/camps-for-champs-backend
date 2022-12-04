import { Injectable } from "@nestjs/common";

@Injectable()
export class CampWishlistService {
  async createCampWishlist(campId: string, userId: string) {
    return { campId, userId };
  }
}
