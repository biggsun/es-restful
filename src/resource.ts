import { ReqParams } from './params';

export class Resource {
    constructor() {

    }

    options(render) {
        render();
    }

    static addParser(params: ReqParams) {
        return function (target: any, propertyKey: string) {
            target[propertyKey]['params'] = params;
        };
    }

    public getMethodProcess(method: string) {
        return this[method.toLowerCase()];
    }
}
