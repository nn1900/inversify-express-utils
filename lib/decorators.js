"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var constants_1 = require("./constants");
exports.injectHttpContext = inversify_1.inject(constants_1.TYPE.HttpContext);
function controller(path) {
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
        inversify_1.decorate(inversify_1.injectable(), target);
        Reflect.defineMetadata(constants_1.METADATA_KEY.controller, currentMetadata, target);
        // We need to create an array that contains the metadata of all
        // the controllers in the application, the metadata cannot be
        // attached to a controller. It needs to be attached to a global
        // We attach metadata to the Reflect object itself to avoid
        // declaring additonal globals. Also, the Reflect is avaiable
        // in both node and web browsers.
        var previousMetadata = Reflect.getMetadata(constants_1.METADATA_KEY.controller, Reflect) || [];
        var newMetadata = __spreadArrays([currentMetadata], previousMetadata);
        Reflect.defineMetadata(constants_1.METADATA_KEY.controller, newMetadata, Reflect);
    };
}
exports.controller = controller;
function all(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["all", path], middleware));
}
exports.all = all;
function httpGet(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["get", path], middleware));
}
exports.httpGet = httpGet;
function httpPost(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["post", path], middleware));
}
exports.httpPost = httpPost;
function httpPut(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["put", path], middleware));
}
exports.httpPut = httpPut;
function httpPatch(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["patch", path], middleware));
}
exports.httpPatch = httpPatch;
function httpHead(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["head", path], middleware));
}
exports.httpHead = httpHead;
function httpDelete(path) {
    var middleware = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middleware[_i - 1] = arguments[_i];
    }
    return httpMethod.apply(void 0, __spreadArrays(["delete", path], middleware));
}
exports.httpDelete = httpDelete;
function httpMethod(method, path) {
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
        if (!Reflect.hasMetadata(constants_1.METADATA_KEY.controllerMethod, target.constructor)) {
            Reflect.defineMetadata(constants_1.METADATA_KEY.controllerMethod, metadataList, target.constructor);
        }
        else {
            metadataList = Reflect.getMetadata(constants_1.METADATA_KEY.controllerMethod, target.constructor);
        }
        metadataList.push(metadata);
    };
}
exports.httpMethod = httpMethod;
exports.request = paramDecoratorFactory(constants_1.PARAMETER_TYPE.REQUEST);
exports.response = paramDecoratorFactory(constants_1.PARAMETER_TYPE.RESPONSE);
exports.requestParam = paramDecoratorFactory(constants_1.PARAMETER_TYPE.PARAMS);
exports.queryParam = paramDecoratorFactory(constants_1.PARAMETER_TYPE.QUERY);
exports.requestBody = paramDecoratorFactory(constants_1.PARAMETER_TYPE.BODY);
exports.requestHeaders = paramDecoratorFactory(constants_1.PARAMETER_TYPE.HEADERS);
exports.cookies = paramDecoratorFactory(constants_1.PARAMETER_TYPE.COOKIES);
exports.next = paramDecoratorFactory(constants_1.PARAMETER_TYPE.NEXT);
exports.principal = paramDecoratorFactory(constants_1.PARAMETER_TYPE.PRINCIPAL);
function registerCustomParamDecorator(parameterType, getter) {
    return paramDecoratorFactory(parameterType, getter);
}
exports.registerCustomParamDecorator = registerCustomParamDecorator;
function paramDecoratorFactory(parameterType, getter) {
    return function (name, defaultValue, type) {
        return params(parameterType, name, getter, defaultValue, type);
    };
}
function params(type, parameterName, getter, defaultValue, valueType) {
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
        if (!Reflect.hasMetadata(constants_1.METADATA_KEY.controllerParameter, target.constructor)) {
            parameterMetadataList.unshift(parameterMetadata);
        }
        else {
            metadataList = Reflect.getMetadata(constants_1.METADATA_KEY.controllerParameter, target.constructor);
            if (metadataList.hasOwnProperty(methodName)) {
                parameterMetadataList = metadataList[methodName];
            }
            parameterMetadataList.unshift(parameterMetadata);
        }
        metadataList[methodName] = parameterMetadataList;
        Reflect.defineMetadata(constants_1.METADATA_KEY.controllerParameter, metadataList, target.constructor);
    };
}
exports.params = params;
