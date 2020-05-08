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
var moment_1 = __importDefault(require("moment"));
var Api_1 = require("../services/financials/Api");
var Metric_1 = require("../services/database/Metric");
var Ticker_1 = require("../services/database/Ticker");
var Value_1 = require("../services/database/Value");
var DownloadBalanceSheets = /** @class */ (function () {
    function DownloadBalanceSheets() {
        this.delay = 0;
        this.repeat = 10000;
    }
    DownloadBalanceSheets.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tickers, _i, tickers_1, ticker, balanceSheets, _a, balanceSheets_1, balanceSheet, stamp, _b, _c, _d, key, value, metric;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, Ticker_1.Ticker.list()];
                    case 1:
                        tickers = _e.sent();
                        _i = 0, tickers_1 = tickers;
                        _e.label = 2;
                    case 2:
                        if (!(_i < tickers_1.length)) return [3 /*break*/, 10];
                        ticker = tickers_1[_i];
                        if (!ticker || !ticker.id) {
                            console.log('ticker', ticker);
                            return [3 /*break*/, 9];
                        }
                        return [4 /*yield*/, Api_1.Api.balanceSheetsQuarterly(ticker.symbol)];
                    case 3:
                        balanceSheets = _e.sent();
                        _a = 0, balanceSheets_1 = balanceSheets;
                        _e.label = 4;
                    case 4:
                        if (!(_a < balanceSheets_1.length)) return [3 /*break*/, 9];
                        balanceSheet = balanceSheets_1[_a];
                        stamp = moment_1.default(balanceSheet['date']).format();
                        _b = [];
                        for (_c in balanceSheet)
                            _b.push(_c);
                        _d = 0;
                        _e.label = 5;
                    case 5:
                        if (!(_d < _b.length)) return [3 /*break*/, 8];
                        key = _b[_d];
                        value = balanceSheet[key];
                        if (!(typeof value === 'number')) return [3 /*break*/, 7];
                        return [4 /*yield*/, Metric_1.Metric.getOrMake(key, 'BalanceSheet')];
                    case 6:
                        metric = _e.sent();
                        if (!metric || !metric.id) {
                            console.log('metric', metric);
                            return [3 /*break*/, 7];
                        }
                        Value_1.Value.insertIgnoreFailure({
                            ticker_id: ticker.id,
                            metric_id: metric.id,
                            stamp: stamp,
                            value: balanceSheet[key],
                        });
                        _e.label = 7;
                    case 7:
                        _d++;
                        return [3 /*break*/, 5];
                    case 8:
                        _a++;
                        return [3 /*break*/, 4];
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return DownloadBalanceSheets;
}());
exports.DownloadBalanceSheets = DownloadBalanceSheets;
//# sourceMappingURL=DownloadBalanceSheets.js.map