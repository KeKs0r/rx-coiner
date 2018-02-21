const ccxt = require('ccxt');
const config = require('./config');
const _ = require('lodash');
const { Observable } = require('rxjs')

const createTickerStream = require('./rx/ticker-rx')
const createArbitrageStream = require('./rx/arbitrage-rx')
const createExchangeStream = require('./rx/exchanges')


//const symbol = 'BTC/EUR'
const symbol = 'LTC/BTC'


const exchanges = createExchangeStream()
const tickerStreams = exchanges
  .filter(ex => {
    return ex.symbols.indexOf(symbol) > -1
  })
  .map(ex => createTickerStream(ex, symbol))

const arbitrage = createArbitrageStream(tickerStreams)

arbitrage.subscribe(console.log, (err) => {
  console.error(err)
})
