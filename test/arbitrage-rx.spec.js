const Rx = require('rxjs')
const createArbitrageStream = require('../rx/arbitrage-rx')
const _ = require('lodash')
const expect = require('unexpected')
const { createRxTestScheduler } = require('marble-test')



describe('Arbitrage Stream', function () {

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

  it.only('Shows arbitrage between two tickers', function () {
    const ts = createRxTestScheduler()
    const firstTicker = ts.createColdObservable('-a--', firstTickerValues)
    const secondTicker = ts.createColdObservable('--f--', secondTickerExchange)

    // const tickers$ = Rx.Observable.from([firstTicker, secondTicker])
    const tickers$ = [firstTicker, secondTicker]

    const arbitrage = createArbitrageStream(tickers$)

    ts.expectObservable(arbitrage).toBe('--x--', {
      x: { bidCode: fc, bid: 19, askCode: sc, ask: 18, arbitrage: 1 },
    })
    ts.flush()
  })

  it('Only emits new arbitrage when something changed', function () {
    const ts = createRxTestScheduler()
    const firstTicker = ts.createColdObservable('-a--a', firstTickerValues)
    const secondTicker = ts.createColdObservable('--f--', secondTickerExchange)
    const arbitrage = createArbitrageStream([firstTicker, secondTicker])

    ts.expectObservable(arbitrage).toBe('--x--', {
      x: { bidCode: fc, bid: 19, askCode: sc, ask: 18, arbitrage: 1 },
    })
    ts.flush()
  })

  it('Updates arbitrage when changed', () => {
    const ts = createRxTestScheduler()

    const m1 = '-a-b-'
    const m2 = '--f-g'
    const firstTicker = ts.createColdObservable(m1, firstTickerValues)
    const secondTicker = ts.createColdObservable(m2, secondTickerExchange)
    const arbitrage = createArbitrageStream([firstTicker, secondTicker])

    ts.expectObservable(arbitrage).toBe('--xyz', {
      x: { bidCode: fc, bid: 19, askCode: sc, ask: 18, arbitrage: 1 },
      y: { bidCode: fc, bid: 20, askCode: sc, ask: 18, arbitrage: 2 },
      z: { bidCode: fc, bid: 20, askCode: sc, ask: 17, arbitrage: 3 },
    })
    ts.flush()
  })


})