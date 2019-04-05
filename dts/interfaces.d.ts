import * as express from "express";
import { interfaces as inversifyInterfaces } from "inversify";
import { PARAMETER_TYPE } from "./constants";
import { HttpResponseMessage } from "./httpResponseMessage";
declare namespace interfaces {
    type Middleware = (inversifyInterfaces.ServiceIdentifier<any> | express.RequestHandler);
    interface ControllerMetadata {
        path: string;
        middleware: Middleware[];
        target: any;
    }
    interface ControllerMethodMetadata extends ControllerMetadata {
        method: string;
        key: string;
    }
    interface ControllerParameterMetadata {
        [methodName: string]: ParameterMetadata[];
    }
    interface ParameterMetadata {
        parameterName?: string;
        injectRoot: boolean;
        index: number;
        type: PARAMETER_TYPE;
        get?: (req: express.Request) => any;
    }
    interface Controller {
    }
    interface HandlerDecorator {
        (target: any, key: string, value: any): void;
    }
    interface ConfigFunction {
        (app: express.Application): void;
    }
    interface RoutingConfig {
        rootPath: string;
    }
    interface Principal {
        details: any;
        isAuthenticated(): Promise<boolean>;
        isResourceOwner(resourceId: any): Promise<boolean>;
        isInRole(role: string): Promise<boolean>;
    }
    interface AuthProvider {
        getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<Principal>;
    }
    interface HttpContext {
        request: express.Request;
        response: express.Response;
        container: inversifyInterfaces.Container;
        user: Principal;
    }
    interface IHttpActionResult {
        executeAsync(): Promise<HttpResponseMessage>;
    }
}
export { interfaces };
