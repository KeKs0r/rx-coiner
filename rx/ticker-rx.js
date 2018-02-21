const { Observable } = require('rxjs')
const ccxt = require('ccxt');
const _ = require('lodash')

function createTickerStream(ex, symbol) {

  const exchange = (_.isString(ex)) ? new ccxt[ex]() : ex

  return Observable
    .timer(0, exchange.rateLimit)
    .exhaustMap(() => {
      return exchange.fetchTicker(symbol)
    })
}

module.exports = createTickerStream