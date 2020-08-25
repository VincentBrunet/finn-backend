import { TickerType } from './../../lib/data/Ticker';

export class EodConstants {
  static symbolTypeToTickerType = new Map<string, TickerType>([
    ['Common Stock', TickerType.CommonStock],
  ]);

  static symbolExchangeWhiteList = new Set<string>([
    'NASDAQ', // USA
    'NYSE', // NYC
    'AMEX', // NYC
    'US', // USA
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
    'FOREX', //   <----- TODO ?
    'INDX', // Indices
    'COMM', // Commodities
    'CC', // Crypto-Currencies
    'TWO', // Taiwan is OTC
    'ETLX', // Italy certificates?
    'BOND', // Bonds
    'EUFUND', // Mostly weird funds
    'MONEY', // Currencies
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
