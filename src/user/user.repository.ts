import { FilterQuery, Model } from "mongoose";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { User } from "./schema";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  get(filter: FilterQuery<User>) {
    return this.model.findOne(filter);
  }

  getWithSelect(filter: FilterQuery<User>, select: string) {
    return this.model.findOne(filter).select(select);
  }

  exists(filter: FilterQuery<User>) {
    return this.model.exists(filter);
  }

  async create(data: Partial<User>) {
    try {
      let user = await this.model.create(data);
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  async save(user: User) {
    return await user.save();
  }

  findAndSet(filter: FilterQuery<User>, update: Partial<User>) {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  deleteUser(filter: FilterQuery<User>) {
    return this.model.deleteOne(filter);
  }
}
