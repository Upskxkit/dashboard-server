"use strict";

import Base from "./base";
import DB from "../../db";
import {IRequest} from "./interface";

let id: number = 0;

export default class Request extends Base {
  constructor(public title: string, public status: string, public id: string) {
    super();
  }

  static async getById(id: string) {
    return DB.get(id);
  }

  static async create(data: IRequest) {
    const {title, status} = data;
    id++;
    const key = id.toString();
    return DB.set(key, new Request(title, status, key))
  }

  static async remove(id: string) {
    const isRemoved = DB.delete(id);
    if (!isRemoved) {
      throw new Error("NO_SUCH_REQUEST");
    }

    return isRemoved;
  }

  static async list() {
    return DB.all();
  }
}
