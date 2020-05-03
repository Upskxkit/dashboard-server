import BaseService from "../service/base";


export async function runServiceClass<T extends BaseService>(serviceClass: { new(args: any): T }, {context = {}, params = {}}) {
    /*function logRequest(type, result, startTime) {
        logger(type, {
            useCase: useCaseClass.name,
            runtime: Date.now() - startTime,
            params,
            result
        });
    }

    const startTime = Date.now();*/

    try {
        const result = await new serviceClass({context}).run(params);

        // logRequest('info', result, startTime);

        return result;
    } catch (error) {
        // const type = error instanceof Exception ? 'warn' : 'error';
        // logRequest(type, error, startTime);

        throw error;
    }
}
