import { Controller } from "@nestjs/common";

import { WishlistService } from "./wishlist.service";

@Controller("/v2/wishlist")
export class WishlistController {
  constructor(private service: WishlistService) {}
}
