"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Connection_1 = require("./Connection");
var Metric = /** @class */ (function () {
    function Metric() {
    }
    Metric.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.Connection.list(Metric.table)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Metric.insert = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.Connection.insert(Metric.table, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Metric.update = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.Connection.update(Metric.table, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Metric.insertIgnoreFailure = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.Connection.insertIgnoreFailure(Metric.table, value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Metric.cacheKey = function (name, category, period) {
        var uppercaseName = name.toUpperCase();
        var uppercaseCategory = category.toUpperCase();
        var uppercasePeriod = period.toUpperCase();
        return uppercaseName + ":" + uppercaseCategory + ":" + uppercasePeriod;
    };
    Metric.makeCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, metric, key;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Metric.cache = new Map();
                        _i = 0;
                        return [4 /*yield*/, Metric.list()];
                    case 1:
                        _a = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        metric = _a[_i];
                        key = Metric.cacheKey(metric.name, metric.category, metric.period);
                        Metric.cache.set(key, metric);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Metric.getOrMake = function (name, category, period) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!Metric.cache) return [3 /*break*/, 2];
                        return [4 /*yield*/, Metric.makeCache()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        key = Metric.cacheKey(name, category, period);
                        if (!!Metric.cache.has(key)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Metric.insertIgnoreFailure({
                                name: name[0].toUpperCase() + name.slice(1),
                                category: category,
                                period: period,
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, Metric.makeCache()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, Metric.cache.get(key)];
                }
            });
        });
    };
    /**
     * Base
     */
    Metric.table = 'metric';
    return Metric;
}());
exports.Metric = Metric;
//# sourceMappingURL=Metric.js.map