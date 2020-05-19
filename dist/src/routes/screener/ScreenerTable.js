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
var fuzzy_search_1 = __importDefault(require("fuzzy-search"));
var moment_1 = __importDefault(require("moment"));
var Metric_1 = require("../../services/database/Metric");
var Ticker_1 = require("../../services/database/Ticker");
var Value_1 = require("../../services/database/Value");
var ScreenerTable = /** @class */ (function () {
    function ScreenerTable() {
    }
    ScreenerTable.prototype.run = function (param) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var columns, tickers, metricsList, metricsSearcher, last, min, max, metricByColumn, valueByTickerIdByColumn, columns_1, columns_1_1, column, metrics, metric, values, valueByTickerId, values_1, values_1_1, value, e_1_1, rows, tickers_1, tickers_1_1, ticker, row, keep, columns_2, columns_2_1, column, value, columnsWithMetrics;
            var e_1, _c, e_2, _d, e_3, _e, e_4, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        columns = ['MarketCap Key', 'DividendYield Key', 'DividendYield Ratio', 'DividendPayout'];
                        return [4 /*yield*/, Ticker_1.Ticker.list()];
                    case 1:
                        tickers = _g.sent();
                        return [4 /*yield*/, Metric_1.Metric.list()];
                    case 2:
                        metricsList = _g.sent();
                        metricsSearcher = new fuzzy_search_1.default(metricsList, ['name', 'category', 'identifier'], {
                            sort: true,
                        });
                        last = moment_1.default().subtract(1, 'quarter');
                        min = moment_1.default(last).startOf('quarter');
                        max = moment_1.default(last).endOf('quarter');
                        metricByColumn = new Map();
                        valueByTickerIdByColumn = new Map();
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 8, 9, 10]);
                        columns_1 = __values(columns), columns_1_1 = columns_1.next();
                        _g.label = 4;
                    case 4:
                        if (!!columns_1_1.done) return [3 /*break*/, 7];
                        column = columns_1_1.value;
                        metrics = metricsSearcher.search(column);
                        metric = metrics[0];
                        metricByColumn.set(column, metric);
                        return [4 /*yield*/, Value_1.Value.listByMetricAndStamp(metric, min, max)];
                    case 5:
                        values = _g.sent();
                        valueByTickerId = new Map();
                        try {
                            for (values_1 = (e_2 = void 0, __values(values)), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                                value = values_1_1.value;
                                valueByTickerId.set(value.ticker_id, value);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (values_1_1 && !values_1_1.done && (_d = values_1.return)) _d.call(values_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        valueByTickerIdByColumn.set(column, valueByTickerId);
                        _g.label = 6;
                    case 6:
                        columns_1_1 = columns_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (columns_1_1 && !columns_1_1.done && (_c = columns_1.return)) _c.call(columns_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        rows = [];
                        try {
                            for (tickers_1 = __values(tickers), tickers_1_1 = tickers_1.next(); !tickers_1_1.done; tickers_1_1 = tickers_1.next()) {
                                ticker = tickers_1_1.value;
                                row = [];
                                row.push(ticker);
                                keep = false;
                                try {
                                    for (columns_2 = (e_4 = void 0, __values(columns)), columns_2_1 = columns_2.next(); !columns_2_1.done; columns_2_1 = columns_2.next()) {
                                        column = columns_2_1.value;
                                        value = (_b = (_a = valueByTickerIdByColumn.get(column)) === null || _a === void 0 ? void 0 : _a.get(ticker.id)) === null || _b === void 0 ? void 0 : _b.value;
                                        if (value === undefined) {
                                            row.push(null);
                                        }
                                        else {
                                            row.push(value);
                                            keep = true;
                                        }
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (columns_2_1 && !columns_2_1.done && (_f = columns_2.return)) _f.call(columns_2);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                                if (keep) {
                                    rows.push(row);
                                }
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (tickers_1_1 && !tickers_1_1.done && (_e = tickers_1.return)) _e.call(tickers_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        columnsWithMetrics = columns.map(function (column) {
                            return {
                                value: column,
                                metric: metricByColumn.get(column),
                            };
                        });
                        return [2 /*return*/, {
                                columns: columnsWithMetrics,
                                rows: rows,
                            }];
                }
            });
        });
    };
    return ScreenerTable;
}());
exports.ScreenerTable = ScreenerTable;
//# sourceMappingURL=ScreenerTable.js.map