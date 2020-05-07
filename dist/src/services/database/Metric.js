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
            var connection, handle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection_1.Connection.get()];
                    case 1:
                        connection = _a.sent();
                        handle = connection(Metric.table);
                        return [4 /*yield*/, handle.select('*')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Metric.insert = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, handle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (value.id !== undefined) {
                            throw Error('Cannot insert with an id');
                        }
                        return [4 /*yield*/, Connection_1.Connection.get()];
                    case 1:
                        connection = _a.sent();
                        handle = connection(Metric.table);
                        return [4 /*yield*/, handle.insert(value)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Metric.update = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, handle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (value.id === undefined) {
                            throw Error('Cannot update without an id');
                        }
                        return [4 /*yield*/, Connection_1.Connection.get()];
                    case 1:
                        connection = _a.sent();
                        handle = connection(Metric.table);
                        return [4 /*yield*/, handle.update(value).where('id', value.id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Utils
     */
    Metric.byName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, mapping, _i, list_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Metric.list()];
                    case 1:
                        list = _a.sent();
                        mapping = new Map();
                        for (_i = 0, list_1 = list; _i < list_1.length; _i++) {
                            item = list_1[_i];
                            mapping.set(item.name, item);
                        }
                        return [2 /*return*/, mapping];
                }
            });
        });
    };
    Metric.byId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, mapping, _i, list_2, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Metric.list()];
                    case 1:
                        list = _a.sent();
                        mapping = new Map();
                        for (_i = 0, list_2 = list; _i < list_2.length; _i++) {
                            item = list_2[_i];
                            if (item.id) {
                                mapping.set(item.id, item);
                            }
                        }
                        return [2 /*return*/, mapping];
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