import { Controller } from "@nestjs/common";

import { CampService } from "./camp.service";

@Controller("/v2/camp")
export class CampController {
  constructor(private service: CampService) {}
}
