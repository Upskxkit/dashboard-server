"use strict";
import BaseService from "../base";

export default class RequestUpdate extends BaseService {
    constructor(args: { context: any }) {
        super(args);
    }

    execution(params: any) {
        return params;
    }
}
