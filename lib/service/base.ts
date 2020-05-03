"use strict";

const LIVR = require("livr");

export default class BaseService {
    static validationRules: {};
    static cachedValidator: Function;
    private context: any;

    constructor(args: { context: any }) {
        if (!args) throw new Error("CONTEXT_REQUIRED");
        this.context = args.context;
    }

    async run(data: any) {
        const clearParams = await this.validate(data);
        return this.execution(clearParams);
    }

    validate(data: Object) {
        // Feel free to override this method if you need dynamic validation

        /*const validator = this.constructor.cachedValidator
            || new LIVR.Validator(this.constructor.validationRules).prepare();

        this.constructor.cachedValidator = validator;

        return this._doValidationWithValidator(data, validator);*/

        return data;
    }

    /* doValidation(data: any, rules: Object) {
         const validator = new LIVR.Validator(rules).prepare();

         return this._doValidationWithValidator(data, validator);
     }
 */

    /*async _doValidationWithValidator(data: any, validator: Object) {
        const result = validator.validate(data);

        if (!result) {
            const exception = new Exception({
                code: 'FORMAT_ERROR',
                fields: validator.getErrors()
            });

            throw exception;
        }

        return result;
    }*/

    execution(params: any) {
        throw new Error(`DEFINE_EXECUTION - ${this.constructor.name}`);
    }
}
