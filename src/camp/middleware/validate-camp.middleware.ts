import { NextFunction, Request, Response } from "express";

import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";

import { CampRepository } from "../camp.repository";

@Injectable()
export class ValidateCampMiddleware implements NestMiddleware {
  constructor(private repository: CampRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    var camp = await this.repository.getCamp(req.params.campId);
    if (!camp) throw new NotFoundException("Camp not found");
    res.locals.camp = camp;
    next();
  }
}
