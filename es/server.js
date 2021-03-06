var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import * as express from "express";
import { BaseMiddleware } from "./index";
import { getControllersFromMetadata, getControllersFromContainer, getControllerMetadata, getControllerMethodMetadata, getControllerParameterMetadata, instanceOfIHttpActionResult } from "./utils";
import { TYPE, METADATA_KEY, DEFAULT_ROUTING_ROOT_PATH, PARAMETER_TYPE, DUPLICATED_CONTROLLER_NAME } from "./constants";
import { HttpResponseMessage } from "./httpResponseMessage";
var InversifyExpressServer = /** @class */ (function () {
    /**
     * Wrapper for the express server.
     *
     * @param container Container loaded with all controllers and their dependencies.
     * @param customRouter optional express.Router custom router
     * @param routingConfig optional interfaces.RoutingConfig routing config
     * @param customApp optional express.Application custom app
     * @param authProvider optional interfaces.AuthProvider auth provider
     * @param forceControllers optional boolean setting to force controllers (defaults do true)
     */
    function InversifyExpressServer(container, customRouter, routingConfig, customApp, authProvider, nonHttpResponseMessageValueHandler, forceControllers) {
        if (forceControllers === void 0) { forceControllers = true; }
        this._container = container;
        this._forceControllers = forceControllers;
        this._router = customRouter || express.Router();
        this._routingConfig = routingConfig || {
            rootPath: DEFAULT_ROUTING_ROOT_PATH
        };
        this._app = customApp || express();
        if (authProvider) {
            this._AuthProvider = authProvider;
            container.bind(TYPE.AuthProvider)
                .to(this._AuthProvider);
        }
        this._nonHttpResponseMessageValueHandler = nonHttpResponseMessageValueHandler;
    }
    /**
     * Sets the configuration function to be applied to the application.
     * Note that the config function is not actually executed until a call to InversifyExpresServer.build().
     *
     * This method is chainable.
     *
     * @param fn Function in which app-level middleware can be registered.
     */
    InversifyExpressServer.prototype.setConfig = function (fn) {
        this._configFn = fn;
        return this;
    };
    /**
     * Sets the error handler configuration function to be applied to the application.
     * Note that the error config function is not actually executed until a call to InversifyExpresServer.build().
     *
     * This method is chainable.
     *
     * @param fn Function in which app-level error handlers can be registered.
     */
    InversifyExpressServer.prototype.setErrorConfig = function (fn) {
        this._errorConfigFn = fn;
        return this;
    };
    /**
     * Applies all routes and configuration to the server, returning the express application.
     */
    InversifyExpressServer.prototype.build = function () {
        var _this = this;
        var _self = this;
        // The very first middleware to be invoked
        // it creates a new httpContext and attaches it to the
        // current request as metadata using Reflect
        this._app.all("*", function (req, res, next) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var httpContext;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _self._createHttpContext(req, res, next)];
                        case 1:
                            httpContext = _a.sent();
                            Reflect.defineMetadata(METADATA_KEY.httpContext, httpContext, req);
                            next();
                            return [2 /*return*/];
                    }
                });
            }); })();
        });
        // register server-level middleware before anything else
        if (this._configFn) {
            this._configFn.apply(undefined, [this._app]);
        }
        this.registerControllers();
        // register error handlers after controllers
        if (this._errorConfigFn) {
            this._errorConfigFn.apply(undefined, [this._app]);
        }
        return this._app;
    };
    InversifyExpressServer.prototype.registerControllers = function () {
        var _this = this;
        // Fake HttpContext is needed during registration
        this._container.bind(TYPE.HttpContext).toConstantValue({});
        var constructors = getControllersFromMetadata();
        constructors.forEach(function (constructor) {
            var name = constructor.name;
            if (_this._container.isBoundNamed(TYPE.Controller, name)) {
                throw new Error(DUPLICATED_CONTROLLER_NAME(name));
            }
            _this._container.bind(TYPE.Controller)
                .to(constructor)
                .whenTargetNamed(name);
        });
        var controllers = getControllersFromContainer(this._container, this._forceControllers);
        controllers.forEach(function (controller) {
            var controllerMetadata = getControllerMetadata(controller.constructor);
            var methodMetadata = getControllerMethodMetadata(controller.constructor);
            var parameterMetadata = getControllerParameterMetadata(controller.constructor);
            if (controllerMetadata && methodMetadata) {
                var controllerMiddleware_1 = _this.resolveMidleware.apply(_this, controllerMetadata.middleware);
                methodMetadata.forEach(function (metadata) {
                    var _a;
                    var paramList = [];
                    if (parameterMetadata) {
                        paramList = parameterMetadata[metadata.key] || [];
                    }
                    var handler = _this.handlerFactory(controllerMetadata.target.name, metadata.key, paramList);
                    var routeMiddleware = _this.resolveMidleware.apply(_this, metadata.middleware);
                    (_a = _this._router)[metadata.method].apply(_a, __spreadArrays(["" + controllerMetadata.path + metadata.path], controllerMiddleware_1, routeMiddleware, [handler]));
                });
            }
        });
        this._app.use(this._routingConfig.rootPath, this._router);
    };
    InversifyExpressServer.prototype.resolveMidleware = function () {
        var _this = this;
        var middleware = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middleware[_i] = arguments[_i];
        }
        return middleware.map(function (middlewareItem) {
            if (!_this._container.isBound(middlewareItem)) {
                return middlewareItem;
            }
            var m = _this._container.get(middlewareItem);
            if (m instanceof BaseMiddleware) {
                var _self_1 = _this;
                return function (req, res, next) {
                    var mReq = _self_1._container.get(middlewareItem);
                    mReq.httpContext = _self_1._getHttpContext(req);
                    mReq.handler(req, res, next);
                };
            }
            return m;
        });
    };
    InversifyExpressServer.prototype.copyHeadersTo = function (headers, target) {
        for (var _i = 0, _a = Object.keys(headers); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            var headerValue = headers[name_1];
            target.append(name_1, typeof headerValue === "number" ? headerValue.toString() : headerValue);
        }
    };
    InversifyExpressServer.prototype.handleHttpResponseMessage = function (message, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.copyHeadersTo(message.headers, res);
                        if (!(message.content !== undefined)) return [3 /*break*/, 2];
                        this.copyHeadersTo(message.content.headers, res);
                        _b = (_a = res.status(message.statusCode)).send;
                        return [4 /*yield*/, message.content.readAsStringAsync()];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 3];
                    case 2:
                        res.sendStatus(message.statusCode);
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    InversifyExpressServer.prototype.handlerFactory = function (controllerName, key, parameterMetadata) {
        var _this = this;
        return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var args, httpContext, controller, value, httpResponseMessage, httpResponseMessage, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        args = this.extractParameters(req, res, next, parameterMetadata);
                        httpContext = this._getHttpContext(req);
                        httpContext.container.bind(TYPE.HttpContext)
                            .toConstantValue(httpContext);
                        controller = httpContext.container.getNamed(TYPE.Controller, controllerName);
                        controller.httpContext = httpContext;
                        return [4 /*yield*/, controller[key].apply(controller, args)];
                    case 1:
                        value = _a.sent();
                        if (!(value instanceof HttpResponseMessage)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.handleHttpResponseMessage(value, res)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 3:
                        if (!instanceOfIHttpActionResult(value)) return [3 /*break*/, 6];
                        return [4 /*yield*/, value.executeAsync()];
                    case 4:
                        httpResponseMessage = _a.sent();
                        return [4 /*yield*/, this.handleHttpResponseMessage(httpResponseMessage, res)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 6:
                        if (!(value instanceof Function)) return [3 /*break*/, 7];
                        value();
                        return [3 /*break*/, 11];
                    case 7:
                        if (!!res.headersSent) return [3 /*break*/, 11];
                        if (!this._nonHttpResponseMessageValueHandler) return [3 /*break*/, 10];
                        return [4 /*yield*/, this._nonHttpResponseMessageValueHandler(value, req)];
                    case 8:
                        httpResponseMessage = _a.sent();
                        if (!httpResponseMessage) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.handleHttpResponseMessage(httpResponseMessage, res)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                    case 10:
                        if (value === undefined) {
                            res.status(204);
                        }
                        res.send(value);
                        _a.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_1 = _a.sent();
                        next(err_1);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        }); };
    };
    InversifyExpressServer.prototype._getHttpContext = function (req) {
        return Reflect.getMetadata(METADATA_KEY.httpContext, req);
    };
    InversifyExpressServer.prototype._createHttpContext = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var principal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getCurrentUser(req, res, next)];
                    case 1:
                        principal = _a.sent();
                        return [2 /*return*/, {
                                request: req,
                                response: res,
                                // We use a childContainer for each request so we can be
                                // sure that the binding is unique for each HTTP request
                                container: this._container.createChild(),
                                user: principal
                            }];
                }
            });
        });
    };
    InversifyExpressServer.prototype._getCurrentUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var authProvider;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._AuthProvider !== undefined)) return [3 /*break*/, 2];
                        authProvider = this._container.get(TYPE.AuthProvider);
                        return [4 /*yield*/, authProvider.getUser(req, res, next)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, Promise.resolve({
                            details: null,
                            isAuthenticated: function () { return Promise.resolve(false); },
                            isInRole: function (role) { return Promise.resolve(false); },
                            isResourceOwner: function (resourceId) { return Promise.resolve(false); }
                        })];
                }
            });
        });
    };
    InversifyExpressServer.prototype.convertParameterValue = function (parameterName, value, defaultValue, valueType) {
        var type = valueType || (defaultValue !== undefined ? (defaultValue === null ? "object" : (typeof defaultValue === "object" ? (Array.isArray(defaultValue) ? "array" : "object") : typeof defaultValue)) : "string");
        var nullable = !type.endsWith("!");
        type = type.replace(/!$/g, "").toLowerCase();
        var missingRequiredQueryParameterError = function () {
            var error = new Error("query parameter " + parameterName + " is required");
            error.code = "missing_required_query_parameter";
            return error;
        };
        var invalidQueryParameterValueError = function () {
            var error = new Error("query parameter " + parameterName + " is invalid");
            error.code = "invalid_query_parameter_value";
            return error;
        };
        if (value === undefined) {
            if (type === "boolean") {
                if (defaultValue !== undefined) {
                    return defaultValue;
                }
                return false;
            }
            if (defaultValue !== undefined) {
                if ((type === "object" || type === "array") &&
                    null === defaultValue &&
                    !nullable) {
                    throw missingRequiredQueryParameterError();
                }
                return defaultValue;
            }
            if (!nullable) {
                throw missingRequiredQueryParameterError();
            }
            return value;
        }
        if (type === "string") {
            return value;
        }
        if (null === defaultValue || (type === "object" || type === "array")) {
            if (value === "") {
                if (!nullable) {
                    throw missingRequiredQueryParameterError();
                }
                return defaultValue;
            }
            var val = void 0;
            try {
                val = JSON.parse(value);
            }
            catch (e) {
                throw invalidQueryParameterValueError();
            }
            if (null === val && !nullable) {
                throw missingRequiredQueryParameterError();
            }
            if (null !== val && typeof val !== "object") {
                throw invalidQueryParameterValueError();
            }
            if (null != val && type === "array" && !Array.isArray(val)) {
                throw invalidQueryParameterValueError();
            }
            return val;
        }
        if (type === "number") {
            if (value === "") {
                if (defaultValue !== undefined) {
                    return defaultValue;
                }
                if (!nullable) {
                    throw missingRequiredQueryParameterError();
                }
                return undefined;
            }
            var val = Number(value);
            if (isNaN(val)) {
                throw invalidQueryParameterValueError();
            }
            return val;
        }
        if (type === "boolean") {
            if (value === "") {
                if (defaultValue !== undefined) {
                    return defaultValue;
                }
            }
            if (!nullable) {
                throw missingRequiredQueryParameterError();
            }
            return /^(true|yes|1)$/i.test(value);
        }
        return value;
    };
    InversifyExpressServer.prototype.extractParameters = function (req, res, next, params) {
        var _this = this;
        var args = [];
        if (!params || !params.length) {
            return [req, res, next];
        }
        params.forEach(function (_a) {
            var type = _a.type, index = _a.index, parameterName = _a.parameterName, injectRoot = _a.injectRoot, get = _a.get, defaultValue = _a.defaultValue, valueType = _a.valueType;
            var value;
            switch (type) {
                case PARAMETER_TYPE.REQUEST:
                    args[index] = req;
                    break;
                case PARAMETER_TYPE.NEXT:
                    args[index] = next;
                    break;
                case PARAMETER_TYPE.PARAMS:
                    value = _this.getParam(req, "params", injectRoot, parameterName);
                    args[index] = _this.convertParameterValue(parameterName, value, defaultValue, valueType);
                    break;
                case PARAMETER_TYPE.QUERY:
                    value = _this.getParam(req, "query", injectRoot, parameterName);
                    args[index] = _this.convertParameterValue(parameterName, value, defaultValue, valueType);
                    break;
                case PARAMETER_TYPE.BODY:
                    args[index] = req.body;
                    break;
                case PARAMETER_TYPE.HEADERS:
                    args[index] = _this.getParam(req, "headers", injectRoot, parameterName);
                    break;
                case PARAMETER_TYPE.COOKIES:
                    args[index] = _this.getParam(req, "cookies", injectRoot, parameterName);
                    break;
                case PARAMETER_TYPE.PRINCIPAL:
                    args[index] = _this._getPrincipal(req);
                    break;
                default:
                    if (get) {
                        args[index] = get(req, parameterName, defaultValue, valueType);
                    }
                    else {
                        args[index] = res;
                    }
                    break; // response
            }
        });
        args.push(req, res, next);
        return args;
    };
    InversifyExpressServer.prototype.getParam = function (source, paramType, injectRoot, name) {
        if (paramType === "headers" && name) {
            name = name.toLowerCase();
        }
        var param = source[paramType];
        if (injectRoot) {
            return param;
        }
        else {
            return (param && name) ? param[name] : undefined;
        }
    };
    InversifyExpressServer.prototype._getPrincipal = function (req) {
        return this._getHttpContext(req).user;
    };
    return InversifyExpressServer;
}());
export { InversifyExpressServer };
