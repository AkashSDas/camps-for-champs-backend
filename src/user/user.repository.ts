import { FilterQuery, Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { User } from "./schemas";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  getUser(filter: FilterQuery<User>) {
    return this.model.findOne(filter);
  }

  getUserWithSelect(filter: FilterQuery<User>, select: string) {
    return this.model.findOne(filter).select(select);
  }

  exists(filter: FilterQuery<User>) {
    return this.model.exists(filter);
  }

  async createUser(data: Partial<User>) {
    return await this.model.create(data);
  }
}
