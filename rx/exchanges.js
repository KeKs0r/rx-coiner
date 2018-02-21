const { Observable } = require('rxjs')
const ccxt = require('ccxt');
const logger = require('../util/logger')

const allExchanges = ccxt.exchanges
const excluded = [
  '_1broker', // Requires API Key
  'btce', // API key?
  'xbtce' //xbtce requires apiKey for all requests, their public API is always busy
]

const included = [
  'bitfinex', 'coinmarketcap', 'kraken',
  /*
  '_1btcxe', 'anxpro', 'bit2c', 'bitbay', 'bitbays', 'bitcoincoid',
   'bitflyer', 'bitlish', 'bitmarket', 'bitmex', 'bitso', 'bitstamp',
  'bittrex', 'bl3p', 'btcchina', 'btcexchange', 'btcmarkets', 'btctradeua',
  'btcturk', 'btcx', 'bter', 'bxinth', 'ccex', 'cex', 'chbtc', 'chilebit',
  'coincheck', 'coinfloor', 'coingi', , 'coinmate', 'coinsecure',
  'coinspot', 'cryptopia', 'dsx', 'exmo', 'flowbtc', 'foxbit', 'fybse', 'fybsg',
  'gatecoin', 'gdax', 'gemini', 'hitbtc', 'huobi', 'itbit', 'jubi',
  'lakebtc', 'livecoin', 'liqui', 'luno', 'mercado', 'okcoincny', 'okcoinusd',
  'paymium', 'poloniex', 'quadrigacx', 'quoine', 'southxchange', 'surbitcoin',
  'therock', 'urdubit', 'vaultoro', 'vbtc', 'virwox', 'yobit', 'yunbi', 'zaif'
  */
]

const relevant = allExchanges.filter(id => included.indexOf(id) > -1)

function getExchanges() {
  const initialized = relevant
    .map(id => new (ccxt)[id]())

  logger.info('Anzahl Exchanges:', initialized.length)

  const exchanges = Observable
    .from(initialized)

  const withMarkets = exchanges.map((ex) => {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      ex.loadMarkets()
        .then((market) => {
          resolve(ex)
        })
        .catch(reject)
    }))
  })
    .mergeAll()
  //.concatAll()
  return withMarkets
}

getExchanges.included = included

module.exports = getExchanges