import { Branded } from './../struct/Branded';

export type MetricId = Branded<number, 'MetricId'>;
export interface Metric extends MetricShell {
  id: MetricId;
}
export interface MetricShell {
  name: MetricName;
  category: MetricCategory;
  period: MetricPeriod;
}

export enum MetricPeriod {
  Daily = 'day',
  Monthly = 'month',
  Quarterly = 'quarter',
  Yearly = 'year',
}

export enum MetricCategory {
  OutstandingShares = 'outstanding-shares',
  CashFlow = 'cash-flow',
  IncomeStatement = 'income-statement',
  BalanceSheet = 'balance-sheet',
  Earning = 'earning',
  Trading = 'trading',
}

export enum MetricName {
  Unknown = 'unknown',
  AccountsPayable = 'accounts-payable',
  AccumulatedAmortization = 'accumulated-amortization',
  AccumulatedDepreciation = 'accumulated-depreciation',
  AccumulatedOtherComprehensiveIncome = 'accumulated-other-comprehensive-income',
  AdditionalPaidInCapital = 'additional-paid-in-capital',
  CapitalExpenditures = 'capital-expenditures',
  CapitalLeaseObligations = 'capital-lease-obligations',
  CapitalSurpluse = 'capital-surpluse',
  Cash = 'cash',
  CashAndCashEquivalentsChanges = 'cash-and-cash-equivalents-changes',
  CashAndShortTermInvestments = 'cash-and-short-term-investments',
  CashFlowsOtherOperating = 'cash-flows-other-operating',
  ChangeInCash = 'change-in-cash',
  ChangeReceivables = 'change-receivables',
  ChangeToAccountReceivables = 'change-to-account-receivables',
  ChangeToInventory = 'change-to-inventory',
  ChangeToLiabilities = 'change-to-liabilities',
  ChangeToNetincome = 'change-to-netincome',
  ChangeToOperatingActivities = 'change-to-operating-activities',
  CommonStock = 'common-stock',
  CommonStockSharesOutstanding = 'common-stock-shares-outstanding',
  CommonStockTotalEquity = 'common-stock-total-equity',
  CostOfRevenue = 'cost-of-revenue',
  DeferredLongTermAssetCharges = 'deferred-long-term-asset-charges',
  DeferredLongTermLiab = 'deferred-long-term-liab',
  Depreciation = 'depreciation',
  DiscontinuedOperations = 'discontinued-operations',
  DividendsPaid = 'dividends-paid',
  EarningAssets = 'earning-assets',
  Ebit = 'ebit',
  EffectOfAccountingCharges = 'effect-of-accounting-charges',
  EpsActual = 'eps-actual',
  EpsDifference = 'eps-difference',
  EpsEstimate = 'eps-estimate',
  ExchangeRateChanges = 'exchange-rate-changes',
  ExtraordinaryItems = 'extraordinary-items',
  GoodWill = 'good-will',
  GrossProfit = 'gross-profit',
  IncomeBeforeTax = 'income-before-tax',
  IncomeTaxExpense = 'income-tax-expense',
  IntangibleAssets = 'intangible-assets',
  InterestExpense = 'interest-expense',
  InterestIncome = 'interest-income',
  Inventory = 'inventory',
  Investments = 'investments',
  LiabilitiesAndStockholdersEquity = 'liabilities-and-stockholders-equity',
  LongTermDebt = 'long-term-debt',
  LongTermDebtTotal = 'long-term-debt-total',
  LongTermInvestments = 'long-term-investments',
  MinorityInterest = 'minority-interest',
  NegativeGoodwill = 'negative-goodwill',
  NetBorrowings = 'net-borrowings',
  NetIncome = 'net-income',
  NetIncomeApplicableToCommonShares = 'net-income-applicable-to-common-shares',
  NetIncomeFromContinuingOps = 'net-income-from-continuing-ops',
  NetInterestIncome = 'net-interest-income',
  NetReceivables = 'net-receivables',
  NetTangibleAssets = 'net-tangible-assets',
  NonCurrentAssetsTotal = 'non-current-assets-total',
  NonCurrentLiabilitiesOther = 'non-current-liabilities-other',
  NonCurrentLiabilitiesTotal = 'non-current-liabilities-total',
  NonCurrrentAssetsOther = 'non-currrent-assets-other',
  NonOperatingIncomeNetOther = 'non-operating-income-net-other',
  NonRecurring = 'non-recurring',
  NoncontrollingInterestInConsolidatedEntity = 'noncontrolling-interest-in-consolidated-entity',
  OperatingIncome = 'operating-income',
  OtherAssets = 'other-assets',
  OtherCashflowsFromFinancingActivities = 'other-cashflows-from-financing-activities',
  OtherCashflowsFromInvestingActivities = 'other-cashflows-from-investing-activities',
  OtherCurrentAssets = 'other-current-assets',
  OtherCurrentLiab = 'other-current-liab',
  OtherItems = 'other-items',
  OtherLiab = 'other-liab',
  OtherOperatingExpenses = 'other-operating-expenses',
  OtherStockholderEquity = 'other-stockholder-equity',
  PreferredStockAndOtherAdjustments = 'preferred-stock-and-other-adjustments',
  PreferredStockRedeemable = 'preferred-stock-redeemable',
  PreferredStockTotalEquity = 'preferred-stock-total-equity',
  PropertyPlantAndEquipmentGross = 'property-plant-and-equipment-gross',
  PropertyPlantEquipment = 'property-plant-equipment',
  ResearchDevelopment = 'research-development',
  RetainedEarnings = 'retained-earnings',
  RetainedEarningsTotalEquity = 'retained-earnings-total-equity',
  SalePurchaseOfStock = 'sale-purchase-of-stock',
  SellingGeneralAdministrative = 'selling-general-administrative',
  Shares = 'shares',
  SharesMln = 'shares-mln',
  ShortLongTermDebt = 'short-long-term-debt',
  ShortLongTermDebtTotal = 'short-long-term-debt-total',
  ShortTermDebt = 'short-term-debt',
  ShortTermInvestments = 'short-term-investments',
  SurprisePercent = 'surprise-percent',
  TaxProvision = 'tax-provision',
  TemporaryEquityRedeemableNoncontrollingInterests = 'temporary-equity-redeemable-noncontrolling-interests',
  TotalAssets = 'total-assets',
  TotalCashFromFinancingActivities = 'total-cash-from-financing-activities',
  TotalCashFromOperatingActivities = 'total-cash-from-operating-activities',
  TotalCashflowsFromInvestingActivities = 'total-cashflows-from-investing-activities',
  TotalCurrentAssets = 'total-current-assets',
  TotalCurrentLiabilities = 'total-current-liabilities',
  TotalLiab = 'total-liab',
  TotalOperatingExpenses = 'total-operating-expenses',
  TotalOtherIncomeExpenseNet = 'total-other-income-expense-net',
  TotalPermanentEquity = 'total-permanent-equity',
  TotalRevenue = 'total-revenue',
  TotalStockholderEquity = 'total-stockholder-equity',
  TreasuryStock = 'treasury-stock',
  Warrants = 'warrants',
  Price = 'price',
}
