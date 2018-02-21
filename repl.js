const Rx = require('rxjs')
const createArbitrageStream = require('./rx/arbitrage-rx')
const _ = require('lodash')
const expect = require('unexpected')
const { createRxTestScheduler } = require('marble-test')



const fc = 'aa'
const firstTickerValues = {
  a: { code: fc, ask: 20, bid: 19 },
  b: { code: fc, ask: 21, bid: 20 }
}

const sc = 'bb'
const secondTickerExchange = {
  f: { code: sc, ask: 18, bid: 17 },
  g: { code: sc, ask: 17, bid: 16 }
}

const ts = createRxTestScheduler()
const firstTicker = ts.createColdObservable('-a--', firstTickerValues)
const secondTicker = ts.createColdObservable('--f--', secondTickerExchange)

const tickers$ = Rx.Observable.from([firstTicker, secondTicker])



const arbitrage = createArbitrageStream(tickers$)

/*
ts.expectObservable(arbitrage).toBe('--x--', {
  x: { bidCode: fc, bid: 19, askCode: sc, ask: 18, arbitrage: 1 },
})
*/


arbitrage.subscribe(console.log, console.error, () => console.log('DONE'))

ts.flush()




