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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var Metric_1 = require("../services/database/Metric");
var Ticker_1 = require("../services/database/Ticker");
var Value_1 = require("../services/database/Value");
var DownloadUtils = /** @class */ (function () {
    function DownloadUtils() {
    }
    DownloadUtils.uploadValuesHistories = function (valuesCategory, valuesQuarterlyHistoryFetcher, valuesYearlyHistoryFetcher) {
        return __awaiter(this, void 0, void 0, function () {
            var tickers, count, i, ticker, values, valuesByStampByMetricId, values_1, values_1_1, value, valuesByStamp, valuesQuarterlyHistory, valuesQuarterlyHistory_1, valuesQuarterlyHistory_1_1, values_2, e_1_1, valuesYearlyHistory, valuesYearlyHistory_1, valuesYearlyHistory_1_1, values_3, e_2_1;
            var e_3, _a, e_1, _b, e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, Ticker_1.Ticker.list()];
                    case 1:
                        tickers = _d.sent();
                        count = tickers.length;
                        i = 0;
                        _d.label = 2;
                    case 2:
                        if (!(i < count)) return [3 /*break*/, 23];
                        ticker = tickers[i];
                        return [4 /*yield*/, Value_1.Value.listByTicker(ticker)];
                    case 3:
                        values = _d.sent();
                        valuesByStampByMetricId = new Map();
                        try {
                            for (values_1 = (e_3 = void 0, __values(values)), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                                value = values_1_1.value;
                                valuesByStamp = valuesByStampByMetricId.get(value.metric_id);
                                if (!valuesByStamp) {
                                    valuesByStamp = new Map();
                                    valuesByStampByMetricId.set(value.metric_id, valuesByStamp);
                                }
                                valuesByStamp.set(value.stamp.getTime(), value);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        return [4 /*yield*/, valuesQuarterlyHistoryFetcher(ticker.symbol)];
                    case 4:
                        valuesQuarterlyHistory = _d.sent();
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 10, 11, 12]);
                        valuesQuarterlyHistory_1 = (e_1 = void 0, __values(valuesQuarterlyHistory)), valuesQuarterlyHistory_1_1 = valuesQuarterlyHistory_1.next();
                        _d.label = 6;
                    case 6:
                        if (!!valuesQuarterlyHistory_1_1.done) return [3 /*break*/, 9];
                        values_2 = valuesQuarterlyHistory_1_1.value;
                        return [4 /*yield*/, DownloadUtils.uploadValues(values_2, ticker, valuesCategory, 'Quarter', valuesByStampByMetricId)];
                    case 7:
                        _d.sent();
                        _d.label = 8;
                    case 8:
                        valuesQuarterlyHistory_1_1 = valuesQuarterlyHistory_1.next();
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (valuesQuarterlyHistory_1_1 && !valuesQuarterlyHistory_1_1.done && (_b = valuesQuarterlyHistory_1.return)) _b.call(valuesQuarterlyHistory_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12: return [4 /*yield*/, valuesYearlyHistoryFetcher(ticker.symbol)];
                    case 13:
                        valuesYearlyHistory = _d.sent();
                        _d.label = 14;
                    case 14:
                        _d.trys.push([14, 19, 20, 21]);
                        valuesYearlyHistory_1 = (e_2 = void 0, __values(valuesYearlyHistory)), valuesYearlyHistory_1_1 = valuesYearlyHistory_1.next();
                        _d.label = 15;
                    case 15:
                        if (!!valuesYearlyHistory_1_1.done) return [3 /*break*/, 18];
                        values_3 = valuesYearlyHistory_1_1.value;
                        return [4 /*yield*/, DownloadUtils.uploadValues(values_3, ticker, valuesCategory, 'Year', valuesByStampByMetricId)];
                    case 16:
                        _d.sent();
                        _d.label = 17;
                    case 17:
                        valuesYearlyHistory_1_1 = valuesYearlyHistory_1.next();
                        return [3 /*break*/, 15];
                    case 18: return [3 /*break*/, 21];
                    case 19:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 21];
                    case 20:
                        try {
                            if (valuesYearlyHistory_1_1 && !valuesYearlyHistory_1_1.done && (_c = valuesYearlyHistory_1.return)) _c.call(valuesYearlyHistory_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 21:
                        console.log("[SYNC]", 
                        // Ticker def
                        DownloadUtils.padPostfix("" + ticker.symbol, 7), '-', DownloadUtils.ellipsis(DownloadUtils.padPostfix("" + ticker.name, 45), 45), 
                        // Sync status
                        DownloadUtils.padPrefix(i + 1, 5, '0'), '/', DownloadUtils.padPrefix(count, 4, '0'), '-', DownloadUtils.padPrefix(valuesQuarterlyHistory.length, 3, '0'), 'x', DownloadUtils.padPrefix(valuesYearlyHistory.length, 3, '0'), 
                        // Sync type
                        DownloadUtils.padPrefix("<" + valuesCategory + ">", 25));
                        _d.label = 22;
                    case 22:
                        i++;
                        return [3 /*break*/, 2];
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    /*
    2019-09-29T22:00:00.000Z
    2019-09-29T22:00:00.000Z
    */
    DownloadUtils.uploadValues = function (object, ticker, category, period, existings) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var stamp, _b, _c, _i, row, value, name_1, key, identifier, metric, existing, e_4;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        stamp = moment_1.default(object['date']).toDate();
                        _b = [];
                        for (_c in object)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 5];
                        row = _b[_i];
                        value = object[row];
                        if (!(typeof value === 'number')) return [3 /*break*/, 4];
                        name_1 = row[0].toUpperCase() + row.slice(1);
                        key = name_1.toUpperCase() + ":" + category.toUpperCase() + ":" + period.toUpperCase();
                        identifier = name_1 + " (" + category + ")";
                        return [4 /*yield*/, Metric_1.Metric.cached(key, name_1, category, identifier, period)];
                    case 2:
                        metric = _d.sent();
                        if (!metric) {
                            return [3 /*break*/, 4];
                        }
                        existing = (_a = existings.get(metric.id)) === null || _a === void 0 ? void 0 : _a.get(stamp.getTime());
                        if (!(!existing || existing.value !== value)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Value_1.Value.insertIgnoreFailure({
                                ticker_id: ticker.id,
                                metric_id: metric.id,
                                stamp: stamp,
                                value: value,
                            })];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_4 = _d.sent();
                        console.log('Could not upload', e_4, object);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DownloadUtils.padPostfix = function (value, size, postfix) {
        var s = value + '';
        while (s.length < size) {
            s = s + (postfix !== null && postfix !== void 0 ? postfix : ' ');
        }
        return s;
    };
    DownloadUtils.padPrefix = function (value, size, prefix) {
        var s = value + '';
        while (s.length < size) {
            s = (prefix !== null && prefix !== void 0 ? prefix : ' ') + s;
        }
        return s;
    };
    DownloadUtils.ellipsis = function (value, size) {
        var s = value + '';
        if (s.length > size) {
            s = s.slice(0, size - 3) + '...';
        }
        return s;
    };
    return DownloadUtils;
}());
exports.DownloadUtils = DownloadUtils;
//# sourceMappingURL=DownloadUtils.js.map