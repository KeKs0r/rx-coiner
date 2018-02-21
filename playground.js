import ccxt from 'ccxt';
import config from './config';
import _ from 'lodash';
import { Observable } from 'rxjs';

import createTickerStream from './rx/ticker-rx'
const createArbitrageStream = require('./rx/arbitrage-rx')




const relevantExchangCodes = ccxt.exchanges
  .map(id => new (ccxt)[id]())
  .filter(e => e.symbols && e.symbols.indexOf('BTC/EUR') > -1)
  .map(ex => ex.id)


const streams = {}
relevantExchangCodes
  .forEach(code => {
    streams[code] = createTickerStream(code, 'BTC/EUR')
  })

const cleanedObs = _.map(streams, (ob, key) => {
  return ob.map((tick) => ({
    code: key,
    ask: tick.ask,
    bid: tick.bid
  }))
})


const combined = Observable.combineLatest(_.toArray(cleanedObs))

const highestBid = combined.map(
  (tickers) => {
    return _(tickers).sortBy('bid').reverse().take(1).value()[0]
  }
).distinctUntilChanged((bid) => bid.bid)

highestBid.subscribe(console.log, console.error, () => console.log('DONE'))

/*
const lowestAsk = combined.map(
  (tickers) => {
    return _(tickers).sortBy('ask').take(1).value()[0]
  }
)//.distinctUntilChanged((ask) => ask.ask)

const arbitrage = highestBid.combineLatest(lowestAsk, (bid, ask) => {
  return {
    bidCode: bid.code,
    bid: bid.bid,
    askCode: ask.code,
    ask: ask.ask,
    arbitrage: bid.bid - ask.ask,
    counter: counter++
  }
})
*/

