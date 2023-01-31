import { CampRepository } from "../camp.repository";
import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class ValidateCampMiddleware implements NestMiddleware {
  constructor(private repository: CampRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    var camp = await this.repository.get({ campId: req.params.campId });
    if (!camp) throw new NotFoundException("Camp not found");
    res.locals.camp = camp;
    next();
  }
}
