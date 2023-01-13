import { Injectable } from "@nestjs/common";

import { CampRepository } from "./camp.repository";

@Injectable()
export class CampService {
  constructor(private repository: CampRepository) {}
}
