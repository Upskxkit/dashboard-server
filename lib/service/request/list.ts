"use strict";
import BaseService from "../base";
import Request from "../../domain-models/request";

export default class RequestList extends BaseService {
    constructor(args: { context: any }) {
        super(args);
    }

    execution() {
        return Request.list();
    }
}
