const Rx = require('rxjs')
const createTickerStream = require('../rx/ticker-rx')
const _ = require('lodash')
const expect = require('unexpected')
const ccxt = require('ccxt');





it('Create TickerStream from exchangecode', function (done) {
  const ticker =
    createTickerStream('bitfinex', 'BTC/USD')
      .first()
      .subscribe((tick) => {
        expect(tick, 'to satisfy', {
          bid: expect.it('to be greater than', 3000),
          ask: expect.it('to be greater than', 3000)
        })
      }, done, done)
})

it('Create TickerStream from exchangecode', function (done) {
  const exchange = new ccxt.bitfinex()
  const ticker =
    createTickerStream(exchange, 'BTC/USD')
      .first()
      .subscribe((tick) => {
        expect(tick, 'to satisfy', {
          bid: expect.it('to be greater than', 3000),
          ask: expect.it('to be greater than', 3000)
        })
      }, done, done)
})

