"use strict";
import Request from "./lib/domain-models/request";

class DB {
    private instance = new Map<string, Request>();

    get(id: string) {
        return this.instance.get(id);
    }

    set(id: string, request: Request) {
        this.instance.set(id, request);
        return request;
    }

    delete(id: string): boolean | undefined {
        if (this.instance.has(id)) {
            this.instance.delete(id);
            return true;
        }
        return undefined;
    }

    all() {
        return [...this.instance.values()]
    }
}

export default new DB();
