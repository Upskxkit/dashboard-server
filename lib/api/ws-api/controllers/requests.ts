"use strict";
import {RequestCreate, RequestDelete, RequestList, RequestUpdate} from "../../../service/request";
import {runServiceClass} from "../../../utils/invokerUtils";

export default {
    list: async (params: any) => runServiceClass(RequestList, {params}),
    create: async (params: any) => runServiceClass(RequestCreate, {params}),
    delete: async () => runServiceClass(RequestDelete, {}),
    update: async (params: { id: string, fields: {} }) => runServiceClass(RequestUpdate, {params})
}
