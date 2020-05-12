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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
    /**
     * Utils
     */
    Metric.byId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, mapping, list_1, list_1_1, item;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Metric.list()];
                    case 1:
                        list = _b.sent();
                        mapping = new Map();
                        try {
                            for (list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                                item = list_1_1.value;
                                if (item.id) {
                                    mapping.set(item.id, item);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [2 /*return*/, mapping];
                }
            });
        });
    };
    Metric.byKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, mapping, list_2, list_2_1, item;
            var e_2, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Metric.list()];
                    case 1:
                        list = _b.sent();
                        mapping = new Map();
                        try {
                            for (list_2 = __values(list), list_2_1 = list_2.next(); !list_2_1.done; list_2_1 = list_2.next()) {
                                item = list_2_1.value;
                                mapping.set(item.key, item);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (list_2_1 && !list_2_1.done && (_a = list_2.return)) _a.call(list_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        return [2 /*return*/, mapping];
                }
            });
        });
    };
    Metric.cached = function (key, name, category, identifier, period) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!Metric.cache) return [3 /*break*/, 2];
                        _a = Metric;
                        return [4 /*yield*/, Metric.byKey()];
                    case 1:
                        _a.cache = _c.sent();
                        _c.label = 2;
                    case 2:
                        if (!!Metric.cache.has(key)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Metric.insertIgnoreFailure({
                                key: key,
                                name: name,
                                category: category,
                                identifier: identifier,
                                period: period,
                            })];
                    case 3:
                        _c.sent();
                        _b = Metric;
                        return [4 /*yield*/, Metric.byKey()];
                    case 4:
                        _b.cache = _c.sent();
                        _c.label = 5;
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