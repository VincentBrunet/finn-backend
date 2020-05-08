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
var BalanceSheets = /** @class */ (function () {
    function BalanceSheets() {
        this.delay = 0;
        this.repeat = 10000;
    }
    BalanceSheets.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tickers, metrics, _i, tickers_1, ticker, balanceSheets, i, metricsNew, _a, balanceSheets_1, balanceSheet, _b, _c, key, _d, balanceSheets_2, balanceSheet, ticker, stamp, _e, _f, key, metric;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, Ticker_1.Ticker.list()];
                    case 1:
                        tickers = _g.sent();
                        return [4 /*yield*/, Metric_1.Metric.byName()];
                    case 2:
                        metrics = _g.sent();
                        _i = 0, tickers_1 = tickers;
                        _g.label = 3;
                    case 3:
                        if (!(_i < tickers_1.length)) return [3 /*break*/, 6];
                        ticker = tickers_1[_i];
                        return [4 /*yield*/, Api_1.Api.balanceSheets(stocks[i].symbol)];
                    case 4:
                        balanceSheets = _g.sent();
                        _g.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        i = 0;
                        _g.label = 7;
                    case 7:
                        if (!(i < stocks.length)) return [3 /*break*/, 10];
                        metricsNew = [];
                        for (_a = 0, balanceSheets_1 = balanceSheets; _a < balanceSheets_1.length; _a++) {
                            balanceSheet = balanceSheets_1[_a];
                            for (_b = 0, _c = Object.keys(balanceSheet); _b < _c.length; _b++) {
                                key = _c[_b];
                                if (typeof balanceSheet[key] === 'number') {
                                    metricsNew.push({
                                        name: this.prettyName(key),
                                        category: 'BalanceSheet',
                                    });
                                }
                            }
                        }
                        return [4 /*yield*/, this.updatedMetrics(metrics, metricsNew)];
                    case 8:
                        metrics = _g.sent();
                        for (_d = 0, balanceSheets_2 = balanceSheets; _d < balanceSheets_2.length; _d++) {
                            balanceSheet = balanceSheets_2[_d];
                            ticker = tickers.get(balanceSheet['symbol']);
                            if (!ticker || !ticker.id) {
                                console.log('NoTicker', balanceSheet, ticker);
                                continue;
                            }
                            stamp = moment_1.default(balanceSheet['date']);
                            for (_e = 0, _f = Object.keys(balanceSheet); _e < _f.length; _e++) {
                                key = _f[_e];
                                if (typeof balanceSheet[key] === 'number') {
                                    metric = metrics.get(this.prettyName(key));
                                    if (!metric || !metric.id) {
                                        console.log('NoMetric', this.prettyName(key), metric);
                                        continue;
                                    }
                                    Value_1.Value.insertIgnoreFailure({
                                        ticker_id: ticker.id,
                                        metric_id: metric.id,
                                        moment: stamp.format(),
                                        value: balanceSheet[key],
                                    });
                                }
                            }
                        }
                        if (i > 10) {
                            return [3 /*break*/, 10];
                        }
                        _g.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    BalanceSheets.prototype.prettyName = function (name) {
        return name[0].toUpperCase() + name.slice(1);
    };
    BalanceSheets.prototype.updatedMetrics = function (index, metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, metrics_1, metric;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, metrics_1 = metrics;
                        _a.label = 1;
                    case 1:
                        if (!(_i < metrics_1.length)) return [3 /*break*/, 4];
                        metric = metrics_1[_i];
                        if (!!index.has(metric.name)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Metric_1.Metric.insert(metric)];
                    case 2:
                        _a.sent();
                        index.set(metric.name, metric);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, Metric_1.Metric.byName()];
                }
            });
        });
    };
    BalanceSheets.prototype.updateTickers = function (index, tickers) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, tickers_2, ticker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, tickers_2 = tickers;
                        _a.label = 1;
                    case 1:
                        if (!(_i < tickers_2.length)) return [3 /*break*/, 4];
                        ticker = tickers_2[_i];
                        if (!!index.has(ticker.symbol)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Ticker_1.Ticker.insert(ticker)];
                    case 2:
                        _a.sent();
                        index.set(ticker.symbol, ticker);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, Ticker_1.Ticker.bySymbol()];
                }
            });
        });
    };
    return BalanceSheets;
}());
exports.BalanceSheets = BalanceSheets;
//# sourceMappingURL=BalanceSheets.js.map