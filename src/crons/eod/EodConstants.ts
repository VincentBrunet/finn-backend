import { MetaName } from './../../lib/data/Meta';
import { MetricName } from './../../lib/data/Metric';
import { TickerType } from './../../lib/data/Ticker';

export class EodConstants {
  /**
   * Which ticker type do we collect prices and fundamental data on
   */
  static tickerTypeWhitelist = new Set<TickerType>([TickerType.CommonStock, TickerType.Currency]);

  /**
   * Which API ticker type correspond to which database ticker type
   */
  static symbolTypeToTickerType = new Map<string, TickerType>([
    ['Common Stock', TickerType.CommonStock],
    ['Currency', TickerType.Currency],
  ]);

  /**
   * Which object key correspond to which database metric name
   */
  static objectKeyToMetricName = new Map<string, MetricName>([
    ['AccountsPayable', MetricName.AccountsPayable],
    ['AccumulatedAmortization', MetricName.AccumulatedAmortization],
    ['AccumulatedDepreciation', MetricName.AccumulatedDepreciation],
    ['AccumulatedOtherComprehensiveIncome', MetricName.AccumulatedOtherComprehensiveIncome],
    ['AdditionalPaidInCapital', MetricName.AdditionalPaidInCapital],
    ['CapitalExpenditures', MetricName.CapitalExpenditures],
    ['CapitalLeaseObligations', MetricName.CapitalLeaseObligations],
    ['CapitalSurpluse', MetricName.CapitalSurpluse],
    ['Cash', MetricName.Cash],
    ['CashAndCashEquivalentsChanges', MetricName.CashAndCashEquivalentsChanges],
    ['CashAndShortTermInvestments', MetricName.CashAndShortTermInvestments],
    ['CashFlowsOtherOperating', MetricName.CashFlowsOtherOperating],
    ['ChangeInCash', MetricName.ChangeInCash],
    ['ChangeReceivables', MetricName.ChangeReceivables],
    ['ChangeToAccountReceivables', MetricName.ChangeToAccountReceivables],
    ['ChangeToInventory', MetricName.ChangeToInventory],
    ['ChangeToLiabilities', MetricName.ChangeToLiabilities],
    ['ChangeToNetincome', MetricName.ChangeToNetincome],
    ['ChangeToOperatingActivities', MetricName.ChangeToOperatingActivities],
    ['CommonStock', MetricName.CommonStock],
    ['CommonStockSharesOutstanding', MetricName.CommonStockSharesOutstanding],
    ['CommonStockTotalEquity', MetricName.CommonStockTotalEquity],
    ['CostOfRevenue', MetricName.CostOfRevenue],
    ['DeferredLongTermAssetCharges', MetricName.DeferredLongTermAssetCharges],
    ['DeferredLongTermLiab', MetricName.DeferredLongTermLiab],
    ['Depreciation', MetricName.Depreciation],
    ['DiscontinuedOperations', MetricName.DiscontinuedOperations],
    ['DividendsPaid', MetricName.DividendsPaid],
    ['EarningAssets', MetricName.EarningAssets],
    ['Ebit', MetricName.Ebit],
    ['EffectOfAccountingCharges', MetricName.EffectOfAccountingCharges],
    ['EpsActual', MetricName.EpsActual],
    ['EpsDifference', MetricName.EpsDifference],
    ['EpsEstimate', MetricName.EpsEstimate],
    ['ExchangeRateChanges', MetricName.ExchangeRateChanges],
    ['ExtraordinaryItems', MetricName.ExtraordinaryItems],
    ['GoodWill', MetricName.GoodWill],
    ['GrossProfit', MetricName.GrossProfit],
    ['IncomeBeforeTax', MetricName.IncomeBeforeTax],
    ['IncomeTaxExpense', MetricName.IncomeTaxExpense],
    ['IntangibleAssets', MetricName.IntangibleAssets],
    ['InterestExpense', MetricName.InterestExpense],
    ['InterestIncome', MetricName.InterestIncome],
    ['Inventory', MetricName.Inventory],
    ['Investments', MetricName.Investments],
    ['LiabilitiesAndStockholdersEquity', MetricName.LiabilitiesAndStockholdersEquity],
    ['LongTermDebt', MetricName.LongTermDebt],
    ['LongTermDebtTotal', MetricName.LongTermDebtTotal],
    ['LongTermInvestments', MetricName.LongTermInvestments],
    ['MinorityInterest', MetricName.MinorityInterest],
    ['NegativeGoodwill', MetricName.NegativeGoodwill],
    ['NetBorrowings', MetricName.NetBorrowings],
    ['NetIncome', MetricName.NetIncome],
    ['NetIncome', MetricName.NetIncome],
    ['NetIncomeApplicableToCommonShares', MetricName.NetIncomeApplicableToCommonShares],
    ['NetIncomeFromContinuingOps', MetricName.NetIncomeFromContinuingOps],
    ['NetInterestIncome', MetricName.NetInterestIncome],
    ['NetReceivables', MetricName.NetReceivables],
    ['NetTangibleAssets', MetricName.NetTangibleAssets],
    ['NonCurrentAssetsTotal', MetricName.NonCurrentAssetsTotal],
    ['NonCurrentLiabilitiesOther', MetricName.NonCurrentLiabilitiesOther],
    ['NonCurrentLiabilitiesTotal', MetricName.NonCurrentLiabilitiesTotal],
    ['NonCurrrentAssetsOther', MetricName.NonCurrrentAssetsOther],
    ['NonOperatingIncomeNetOther', MetricName.NonOperatingIncomeNetOther],
    ['NonRecurring', MetricName.NonRecurring],
    [
      'NoncontrollingInterestInConsolidatedEntity',
      MetricName.NoncontrollingInterestInConsolidatedEntity,
    ],
    ['OperatingIncome', MetricName.OperatingIncome],
    ['OtherAssets', MetricName.OtherAssets],
    ['OtherCashflowsFromFinancingActivities', MetricName.OtherCashflowsFromFinancingActivities],
    ['OtherCashflowsFromInvestingActivities', MetricName.OtherCashflowsFromInvestingActivities],
    ['OtherCurrentAssets', MetricName.OtherCurrentAssets],
    ['OtherCurrentLiab', MetricName.OtherCurrentLiab],
    ['OtherItems', MetricName.OtherItems],
    ['OtherLiab', MetricName.OtherLiab],
    ['OtherOperatingExpenses', MetricName.OtherOperatingExpenses],
    ['OtherStockholderEquity', MetricName.OtherStockholderEquity],
    ['PreferredStockAndOtherAdjustments', MetricName.PreferredStockAndOtherAdjustments],
    ['PreferredStockRedeemable', MetricName.PreferredStockRedeemable],
    ['PreferredStockTotalEquity', MetricName.PreferredStockTotalEquity],
    ['PropertyPlantAndEquipmentGross', MetricName.PropertyPlantAndEquipmentGross],
    ['PropertyPlantEquipment', MetricName.PropertyPlantEquipment],
    ['ResearchDevelopment', MetricName.ResearchDevelopment],
    ['RetainedEarnings', MetricName.RetainedEarnings],
    ['RetainedEarningsTotalEquity', MetricName.RetainedEarningsTotalEquity],
    ['SalePurchaseOfStock', MetricName.SalePurchaseOfStock],
    ['SellingGeneralAdministrative', MetricName.SellingGeneralAdministrative],
    ['Shares', MetricName.Shares],
    ['SharesMln', MetricName.SharesMln],
    ['ShortLongTermDebt', MetricName.ShortLongTermDebt],
    ['ShortLongTermDebtTotal', MetricName.ShortLongTermDebtTotal],
    ['ShortTermDebt', MetricName.ShortTermDebt],
    ['ShortTermInvestments', MetricName.ShortTermInvestments],
    ['SurprisePercent', MetricName.SurprisePercent],
    ['TaxProvision', MetricName.TaxProvision],
    [
      'TemporaryEquityRedeemableNoncontrollingInterests',
      MetricName.TemporaryEquityRedeemableNoncontrollingInterests,
    ],
    ['TotalAssets', MetricName.TotalAssets],
    ['TotalCashFromFinancingActivities', MetricName.TotalCashFromFinancingActivities],
    ['TotalCashFromOperatingActivities', MetricName.TotalCashFromOperatingActivities],
    ['TotalCashflowsFromInvestingActivities', MetricName.TotalCashflowsFromInvestingActivities],
    ['TotalCurrentAssets', MetricName.TotalCurrentAssets],
    ['TotalCurrentLiabilities', MetricName.TotalCurrentLiabilities],
    ['TotalLiab', MetricName.TotalLiab],
    ['TotalOperatingExpenses', MetricName.TotalOperatingExpenses],
    ['TotalOtherIncomeExpenseNet', MetricName.TotalOtherIncomeExpenseNet],
    ['TotalPermanentEquity', MetricName.TotalPermanentEquity],
    ['TotalRevenue', MetricName.TotalRevenue],
    ['TotalStockholderEquity', MetricName.TotalStockholderEquity],
    ['TreasuryStock', MetricName.TreasuryStock],
    ['Warrants', MetricName.Warrants],
    ['Price', MetricName.Price],
  ]);

  /**
   * Which object key correspond to which database meta type
   */
  static objectKeyToMetaName = new Map<string, MetaName>([
    ['LogoURL', MetaName.Logo],
    ['Description', MetaName.Description],
    ['Sector', MetaName.Sector],
    ['Industry', MetaName.Industry],
    ['Address', MetaName.Address],
    ['WebURL', MetaName.Website],
    ['HomeCategory', MetaName.Category],
    ['Exchange', MetaName.Exchange],
    ['FullTimeEmployees', MetaName.Employees],
  ]);

  static symbolExchangeWhitelist = new Set<string>([
    'NASDAQ', // USA
    'NYSE', // NYC
    'AMEX', // NYC
    'US', // USA
    'FOREX', // Currency pairs
  ]);

  static symbolExchangeBlacklist = new Set<string | null>([
    null, // is full of weird tickers
    'LGVW-UN', // This is clearly a bug from API
    'PINK', // is OTC, bad fundamental data
    'OTCBB', // is OTC, bad fundamental data
    'OTCGREY', // is OTC, bad fundamental data
    'OTCMKTS', // is OTC, bad fundamental data
    'OTCQB', // is OTC, bad fundamental data
    'OTCQX', // is OTC, bad fundamental data
    'OTCCE', // is OTC, bad fundamental data
    'Futures', // Contains future contracts only ?
    'INDX', // Indices
    'COMM', // Commodities
    'CC', // Crypto-Currencies
    'TWO', // Taiwan is OTC
    'ETLX', // Italy certificates?
    'BOND', // Bonds
    'EUFUND', // Mostly weird funds
    'MONEY', // Currencies (EU exchanges)
    'GBOND', // Country bonds
    'IL', // Unknown country stocks
  ]);

  static symbolExchangeExperimentals = new Set<string>([
    'V', // Canada
    'ASX', // Canada
    'CSE', // Canada
    'LSE', // London
    'PA', // Paris
    'BE', // Berlin
    'HK', // Hong Kong

    'MCX', // Russia (Moscow)
    'TW', // Taiwan
    'IS', // Turkey (Istanbul)
    'MX', // Mexico
    'BA', // Argentina
    'SA', // Brazil
    'KLSE', // Malaysia (Kuala Lumpur)
    'VN', // Vietnam
    'JK', // Indonesia (Jakarta)
    'AU', // Australia
    'SHG', // China (Shanghai)
    'SHE', // China (Shenzhen)
    'NSE', // India
    'BSE', // India
    'JSE', // South Africa
    'BK', // Thailand (Bangkok)
    'SR', // Saudi arabia
    'TSE', // Japan
    'AT', // Greece (Atheenes)
    'PSE', // Philipines
    'KAR', // Pakistan
    'SG', // Singapore
    'WAR', // Poland (Warsaw)
    'KQ', // Korea
    'KO', // Korea
    'TA', // Israel (Tel Aviv)
    'NFN', // Sweden
    'CO', // Denmark (Copenhagen)
    'OL', // Normay
    'IC', // Iceland
    'HE', // Finland (Helsinki?)
    'IR', // Ireland
    'LS', // Portugal
    'AS', // Netherland
    'MC', // Spain
    'SW', // Switzerland
    'VX', // Switzerland
    'BR', // Belgium
    'MI', // Italy
    'VI', // Austria
    'F', // Germany (Frankfurt?)
    'STU', // Germany
    'MU', // Germany
    'XETRA', // Germany
    'HA', // Germany
    'HM', // Germany
    'DU', // Germany (Dusseldorf)
    'TO', // Canada (Toronto)
    'ST', // Sweden
    'NB', // Baltic?
    'BUD', // Hungary
    'SN', // Chile
    'ZSE', // Croatia
    'LIM', // Peru

    'NMFQS', // Massive amount of FUNDs
    'BATS', // Contains full ETF ?
    'NYSE ARCA', // Contains full ETF ?
    'NYSE MKT', // Mostly Prefered shares
    'LU', // Luxembourg seems to have only funds?
  ]);
}
