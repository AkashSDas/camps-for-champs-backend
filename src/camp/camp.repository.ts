import { Camp } from "./schema";
import { FilterQuery, Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CampRepository {
  constructor(@InjectModel(Camp.name) private model: Model<Camp>) {}

  get(filter: FilterQuery<Camp>) {
    return this.model.findOne(filter);
  }

  exists(filter: FilterQuery<Camp>) {
    return this.model.exists(filter);
  }

  async create(data: Partial<Camp>) {
    return await this.model.create(data);
  }

  async save(user: Camp) {
    return await user.save();
  }

  findAndSet(filter: FilterQuery<Camp>, update: Partial<Camp>) {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  update(filter: FilterQuery<Camp>, update: Partial<Camp>) {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  delete(filter: FilterQuery<Camp>) {
    return this.model.findOneAndDelete(filter);
  }

  find(filter: FilterQuery<Camp>) {
    return this.model.find(filter);
  }

  findOne(filter: FilterQuery<Camp>) {
    return this.model.findOne(filter);
  }
}
