"use strict";
import BaseService from "../base";
import Request from "../../domain-models/request";
import {IRequest} from "../../domain-models/interface";

export default class RequestCreate extends BaseService {
    constructor(args: { context: any }) {
        super(args);
    }

    async execution(params: IRequest) {
        console.log("params", params);
        return Request.create(params);
    }
}
