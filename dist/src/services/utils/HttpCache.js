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
var axios_1 = __importDefault(require("axios"));
var FileSystem_1 = require("./FileSystem");
var url_1 = require("url");
var debug = true;
var HttpCache = /** @class */ (function () {
    function HttpCache() {
    }
    HttpCache.prepare = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_1, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, FileSystem_1.FileSystem.list(HttpCache.directory)];
                    case 1:
                        files = _a.sent();
                        _i = 0, files_1 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_1.length)) return [3 /*break*/, 5];
                        file = files_1[_i];
                        if (!file.endsWith('.lock')) return [3 /*break*/, 4];
                        if (debug) {
                            console.log('HTTP-CACHE >> CLEANUP >>', file);
                        }
                        return [4 /*yield*/, FileSystem_1.FileSystem.delete(HttpCache.directory + "/" + file)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    HttpCache.get = function (url, extension, code) {
        return __awaiter(this, void 0, void 0, function () {
            var simplified, path, lock, data, buffer, e_1, response, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        simplified = HttpCache.simplify(url);
                        path = HttpCache.directory + "/" + simplified + "-" + code + "." + extension;
                        lock = path + '.lock';
                        return [4 /*yield*/, FileSystem_1.FileSystem.mkdir(HttpCache.directory)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, FileSystem_1.FileSystem.wait(lock)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 10]);
                        return [4 /*yield*/, FileSystem_1.FileSystem.read(path)];
                    case 4:
                        buffer = _a.sent();
                        if (debug) {
                            console.log('HTTP-CACHE >> HIT! >>', url);
                        }
                        data = buffer.toString();
                        return [3 /*break*/, 10];
                    case 5:
                        e_1 = _a.sent();
                        return [4 /*yield*/, FileSystem_1.FileSystem.lock(lock)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, axios_1.default.get(url, {
                                responseType: 'arraybuffer',
                            })];
                    case 7:
                        response = _a.sent();
                        buffer = response.data;
                        if (debug) {
                            console.log('HTTP-CACHE >> MISS >>', url);
                        }
                        data = buffer.toString();
                        return [4 /*yield*/, FileSystem_1.FileSystem.write(path, buffer)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, FileSystem_1.FileSystem.unlock(lock)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, data];
                }
            });
        });
    };
    HttpCache.simplify = function (url) {
        var parsed = new url_1.URL(url);
        var cleaned = parsed.hostname + '-' + parsed.pathname;
        cleaned = cleaned.replace(/\//g, '-');
        cleaned = cleaned.replace(/\:/g, '-');
        cleaned = cleaned.replace(/\./g, '-');
        cleaned = cleaned.replace(/\-\-/g, '-');
        cleaned = cleaned.replace(/\-\-/g, '-');
        return cleaned;
    };
    HttpCache.directory = './cache';
    return HttpCache;
}());
exports.HttpCache = HttpCache;
//# sourceMappingURL=HttpCache.js.map