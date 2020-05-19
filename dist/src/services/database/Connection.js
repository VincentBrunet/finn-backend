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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = __importDefault(require("knex"));
var knexfile_1 = __importDefault(require("../../config/knexfile"));
var debug = false;
var Connection = /** @class */ (function () {
    function Connection() {
    }
    Connection.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!Connection.knex) return [3 /*break*/, 2];
                        _a = Connection;
                        return [4 /*yield*/, knex_1.default(knexfile_1.default)];
                    case 1:
                        _a.knex = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, Connection.knex];
                }
            });
        });
    };
    /**
     * Base operations
     */
    Connection.get = function (table, id) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection.connect()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.select('*').where('id', id).from(table)];
                    case 2:
                        value = _a.sent();
                        if (debug) {
                            console.log('get', value);
                        }
                        return [2 /*return*/, value];
                }
            });
        });
    };
    Connection.list = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var connection, values;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Connection.connect()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.select('*').from(table)];
                    case 2:
                        values = _a.sent();
                        if (debug) {
                            console.log('list', values);
                        }
                        return [2 /*return*/, values];
                }
            });
        });
    };
    Connection.update = function (table, value) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (debug) {
                            console.log('update', value);
                        }
                        return [4 /*yield*/, Connection.connect()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.update(value).from(table)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Connection.insert = function (table, value) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (debug) {
                            console.log('insert', value);
                        }
                        return [4 /*yield*/, Connection.connect()];
                    case 1:
                        connection = _a.sent();
                        return [4 /*yield*/, connection.insert(value).into(table)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Connection.insertBatch = function (table, values) {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (debug) {
                            console.log('insert', values);
                        }
                        return [4 /*yield*/, Connection.connect()];
                    case 1:
                        connection = _a.sent();
                        return [2 /*return*/, connection.batchInsert(table, values, 100)];
                }
            });
        });
    };
    /**
     * Base operations wrappers
     */
    Connection.insertIgnoreFailure = function (table, value) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection.insert(table, value)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map