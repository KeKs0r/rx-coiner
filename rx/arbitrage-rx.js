
const _ = require('lodash');
const { Observable } = require('rxjs')
const ccxt = require('ccxt')
const createTickerStream = require('./ticker-rx')



function createArbitrageStream(tickerStreams) {

  const combined = Observable
    .combineLatest(tickerStreams)
    .flatMap()

  const highestBid = combined.map(
    (tickers) => {
      console.log(tickers)
      return _(tickers).sortBy('bid').reverse().take(1).value()[0]
    }
  )//.distinctUntilChanged((a, b) => (a.bid === b.bid))


  return highestBid

  const lowestAsk = combined.map(
    (tickers) => {
      return _(tickers).sortBy('ask').take(1).value()[0]
    }
  )//.distinctUntilChanged((a, b) => (a.ask === b.ask))

  const arbitrage = highestBid.combineLatest(lowestAsk, (bid, ask) => {
    return {
      bidCode: bid.code,
      bid: bid.bid,
      askCode: ask.code,
      ask: ask.ask,
      arbitrage: bid.bid - ask.ask,
    }
  })

  return arbitrage
}

module.exports = createArbitrageStream
