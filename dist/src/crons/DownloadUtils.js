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
            var tickers, count, i, ticker, values, valuesByStampByMetricId, values_1, values_1_1, value, valuesByStamp, valuesQuarterlyHistory, valuesYearlyHistory;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Ticker_1.Ticker.list()];
                    case 1:
                        tickers = _b.sent();
                        count = tickers.length;
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < count)) return [3 /*break*/, 9];
                        ticker = tickers[i];
                        return [4 /*yield*/, Value_1.Value.listByTicker(ticker)];
                    case 3:
                        values = _b.sent();
                        valuesByStampByMetricId = new Map();
                        try {
                            for (values_1 = (e_1 = void 0, __values(values)), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                                value = values_1_1.value;
                                valuesByStamp = valuesByStampByMetricId.get(value.metric_id);
                                if (!valuesByStamp) {
                                    valuesByStamp = new Map();
                                    valuesByStampByMetricId.set(value.metric_id, valuesByStamp);
                                }
                                valuesByStamp.set(value.stamp.getTime(), value);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        return [4 /*yield*/, valuesQuarterlyHistoryFetcher(ticker.symbol)];
                    case 4:
                        valuesQuarterlyHistory = _b.sent();
                        return [4 /*yield*/, DownloadUtils.uploadValuesHistory(valuesQuarterlyHistory, ticker, valuesCategory, 'Quarter', valuesByStampByMetricId)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, valuesYearlyHistoryFetcher(ticker.symbol)];
                    case 6:
                        valuesYearlyHistory = _b.sent();
                        return [4 /*yield*/, DownloadUtils.uploadValuesHistory(valuesYearlyHistory, ticker, valuesCategory, 'Year', valuesByStampByMetricId)];
                    case 7:
                        _b.sent();
                        console.log("[SYNC]", 
                        // Ticker def
                        DownloadUtils.padPostfix("" + ticker.symbol, 7), '-', DownloadUtils.ellipsis(DownloadUtils.padPostfix("" + ticker.name, 45), 45), 
                        // Sync status
                        DownloadUtils.padPrefix(i + 1, 5, '0'), '/', DownloadUtils.padPrefix(count, 4, '0'), '-', DownloadUtils.padPrefix(valuesQuarterlyHistory.length, 3, '0'), 'x', DownloadUtils.padPrefix(valuesYearlyHistory.length, 3, '0'), 
                        // Sync type
                        DownloadUtils.padPrefix("<" + valuesCategory + ">", 25));
                        _b.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 2];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    DownloadUtils.uploadValuesHistory = function (objects, ticker, category, period, existings) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var inserts, updates, objects_1, objects_1_1, object, stamp, time, _b, _c, _i, row, item, value, name_1, metric, existing, e_2_1, updates_1, updates_1_1, update, e_3_1, e_4;
            var e_2, _d, e_3, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 21, , 22]);
                        inserts = [];
                        updates = [];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 8, 9, 10]);
                        objects_1 = __values(objects), objects_1_1 = objects_1.next();
                        _f.label = 2;
                    case 2:
                        if (!!objects_1_1.done) return [3 /*break*/, 7];
                        object = objects_1_1.value;
                        stamp = moment_1.default(object['date']).toDate();
                        time = stamp.getTime();
                        if (isNaN(time)) {
                            return [3 /*break*/, 6];
                        }
                        _b = [];
                        for (_c in object)
                            _b.push(_c);
                        _i = 0;
                        _f.label = 3;
                    case 3:
                        if (!(_i < _b.length)) return [3 /*break*/, 6];
                        row = _b[_i];
                        item = object[row];
                        if (!(typeof item === 'number')) return [3 /*break*/, 5];
                        value = parseFloat(item.toPrecision(15));
                        name_1 = row[0].toUpperCase() + row.slice(1);
                        return [4 /*yield*/, Metric_1.Metric.lookup(name_1, category, period)];
                    case 4:
                        metric = _f.sent();
                        if (!metric) {
                            return [3 /*break*/, 5];
                        }
                        existing = (_a = existings.get(metric.id)) === null || _a === void 0 ? void 0 : _a.get(time);
                        if (!existing) {
                            inserts.push({
                                ticker_id: ticker.id,
                                metric_id: metric.id,
                                stamp: stamp,
                                value: value,
                            });
                        }
                        if (existing && (existing === null || existing === void 0 ? void 0 : existing.value) != value) {
                            updates.push({
                                id: existing === null || existing === void 0 ? void 0 : existing.id,
                                ticker_id: ticker.id,
                                metric_id: metric.id,
                                stamp: stamp,
                                value: value,
                            });
                        }
                        _f.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        objects_1_1 = objects_1.next();
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_2_1 = _f.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (objects_1_1 && !objects_1_1.done && (_d = objects_1.return)) _d.call(objects_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        if (!(inserts.length > 0)) return [3 /*break*/, 12];
                        console.log('INSERTING', inserts.length);
                        return [4 /*yield*/, Value_1.Value.insertBatch(inserts)];
                    case 11:
                        _f.sent();
                        _f.label = 12;
                    case 12:
                        if (!(updates.length > 0)) return [3 /*break*/, 20];
                        console.log('UPDATING', updates.length);
                        _f.label = 13;
                    case 13:
                        _f.trys.push([13, 18, 19, 20]);
                        updates_1 = __values(updates), updates_1_1 = updates_1.next();
                        _f.label = 14;
                    case 14:
                        if (!!updates_1_1.done) return [3 /*break*/, 17];
                        update = updates_1_1.value;
                        return [4 /*yield*/, Value_1.Value.update(update)];
                    case 15:
                        _f.sent();
                        _f.label = 16;
                    case 16:
                        updates_1_1 = updates_1.next();
                        return [3 /*break*/, 14];
                    case 17: return [3 /*break*/, 20];
                    case 18:
                        e_3_1 = _f.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 20];
                    case 19:
                        try {
                            if (updates_1_1 && !updates_1_1.done && (_e = updates_1.return)) _e.call(updates_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 20: return [3 /*break*/, 22];
                    case 21:
                        e_4 = _f.sent();
                        console.log('Could not upload', e_4);
                        return [3 /*break*/, 22];
                    case 22: return [2 /*return*/];
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