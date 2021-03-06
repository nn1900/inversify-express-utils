var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { inject, injectable, decorate } from "inversify";
import { TYPE, METADATA_KEY, PARAMETER_TYPE } from "./constants";
export var injectHttpContext = inject(TYPE.HttpContext);
export function controller(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return function (target) {
        var currentMetadata = {
            middleware: middleware,
            path: path,
            target: target
        };
        decorate(injectable(), target);
        Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);
        // We need to create an array that contains the metadata of all
        // the controllers in the application, the metadata cannot be
        // attached to a controller. It needs to be attached to a global
        // We attach metadata to the Reflect object itself to avoid
        // declaring additonal globals. Also, the Reflect is avaiable
        // in both node and web browsers.
        var previousMetadata = Reflect.getMetadata(METADATA_KEY.controller, Reflect) || [];
        var newMetadata = __spreadArrays([currentMetadata], previousMetadata);
        Reflect.defineMetadata(METADATA_KEY.controller, newMetadata, Reflect);
    };
}
export function all(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["all", path], middleware));
}
export function httpGet(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["get", path], middleware));
}
export function httpPost(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["post", path], middleware));
}
export function httpPut(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["put", path], middleware));
}
export function httpPatch(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["patch", path], middleware));
}
export function httpHead(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["head", path], middleware));
}
export function httpDelete(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["delete", path], middleware));
}
export function httpMethod(method, path) {
    var middleware = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        middleware[_i - 2] = arguments[_i];
    }
    return function (target, key, value) {
        var metadata = {
            key: key,
            method: method,
            middleware: middleware,
            path: path,
            target: target
        };
        var metadataList = [];
        if (!Reflect.hasMetadata(METADATA_KEY.controllerMethod, target.constructor)) {
            Reflect.defineMetadata(METADATA_KEY.controllerMethod, metadataList, target.constructor);
        }
        else {
            metadataList = Reflect.getMetadata(METADATA_KEY.controllerMethod, target.constructor);
        }
        metadataList.push(metadata);
    };
}
export var request = paramDecoratorFactory(PARAMETER_TYPE.REQUEST);
export var response = paramDecoratorFactory(PARAMETER_TYPE.RESPONSE);
export var requestParam = paramDecoratorFactory(PARAMETER_TYPE.PARAMS);
export var queryParam = paramDecoratorFactory(PARAMETER_TYPE.QUERY);
export var requestBody = paramDecoratorFactory(PARAMETER_TYPE.BODY);
export var requestHeaders = paramDecoratorFactory(PARAMETER_TYPE.HEADERS);
export var cookies = paramDecoratorFactory(PARAMETER_TYPE.COOKIES);
export var next = paramDecoratorFactory(PARAMETER_TYPE.NEXT);
export var principal = paramDecoratorFactory(PARAMETER_TYPE.PRINCIPAL);
export function registerCustomParamDecorator(parameterType, getter) {
    return paramDecoratorFactory(parameterType, getter);
}
function paramDecoratorFactory(parameterType, getter) {
    return function (name, defaultValue, type) {
        return params(parameterType, name, getter, defaultValue, type);
    };
}
export function params(type, parameterName, getter, defaultValue, valueType) {
    return function (target, methodName, index) {
        var metadataList = {};
        var parameterMetadataList = [];
        var parameterMetadata = {
            index: index,
            injectRoot: parameterName === undefined,
            parameterName: parameterName,
            type: type,
            get: getter,
            defaultValue: defaultValue,
            valueType: valueType
        };
        if (!Reflect.hasMetadata(METADATA_KEY.controllerParameter, target.constructor)) {
            parameterMetadataList.unshift(parameterMetadata);
        }
        else {
            metadataList = Reflect.getMetadata(METADATA_KEY.controllerParameter, target.constructor);
            if (metadataList.hasOwnProperty(methodName)) {
                parameterMetadataList = metadataList[methodName];
            }
            parameterMetadataList.unshift(parameterMetadata);
        }
        metadataList[methodName] = parameterMetadataList;
        Reflect.defineMetadata(METADATA_KEY.controllerParameter, metadataList, target.constructor);
    };
}
