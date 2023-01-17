import { Injectable } from "@nestjs/common";

import { WishlistRepository } from "./wishlist.repository";

@Injectable()
export class WishlistService {
  constructor(private repository: WishlistRepository) {}
}
