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
var Api_1 = require("../services/financials/Api");
var Ticker_1 = require("../services/database/Ticker");
var DownloadUtils_1 = require("./DownloadUtils");
var DownloadFinancialKeyMetrics = /** @class */ (function () {
    function DownloadFinancialKeyMetrics() {
        this.delay = 0;
        this.repeat = 10000;
    }
    DownloadFinancialKeyMetrics.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tickers, _i, tickers_1, ticker, valuesQuarterlyHistory, _a, valuesQuarterlyHistory_1, values, valuesYearlyHistory, _b, valuesYearlyHistory_1, values;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Ticker_1.Ticker.list()];
                    case 1:
                        tickers = _c.sent();
                        _i = 0, tickers_1 = tickers;
                        _c.label = 2;
                    case 2:
                        if (!(_i < tickers_1.length)) return [3 /*break*/, 13];
                        ticker = tickers_1[_i];
                        return [4 /*yield*/, Api_1.Api.financialKeyMetricsQuarterly(ticker.symbol)];
                    case 3:
                        valuesQuarterlyHistory = _c.sent();
                        _a = 0, valuesQuarterlyHistory_1 = valuesQuarterlyHistory;
                        _c.label = 4;
                    case 4:
                        if (!(_a < valuesQuarterlyHistory_1.length)) return [3 /*break*/, 7];
                        values = valuesQuarterlyHistory_1[_a];
                        return [4 /*yield*/, DownloadUtils_1.DownloadUtils.uploadValues(values, ticker, 'FinancialKeyMetric', 'Quarter')];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        _a++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, Api_1.Api.financialKeyMetricsYearly(ticker.symbol)];
                    case 8:
                        valuesYearlyHistory = _c.sent();
                        _b = 0, valuesYearlyHistory_1 = valuesYearlyHistory;
                        _c.label = 9;
                    case 9:
                        if (!(_b < valuesYearlyHistory_1.length)) return [3 /*break*/, 12];
                        values = valuesYearlyHistory_1[_b];
                        return [4 /*yield*/, DownloadUtils_1.DownloadUtils.uploadValues(values, ticker, 'FinancialKeyMetric', 'Year')];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11:
                        _b++;
                        return [3 /*break*/, 9];
                    case 12:
                        _i++;
                        return [3 /*break*/, 2];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    return DownloadFinancialKeyMetrics;
}());
exports.DownloadFinancialKeyMetrics = DownloadFinancialKeyMetrics;
//# sourceMappingURL=DownloadFinancialKeyMetrics.js.map