const Rx = require('rxjs')
const createExchangesStream = require('../rx/exchanges')
const _ = require('lodash')
const expect = require('unexpected')
const { createRxTestScheduler } = require('marble-test')


const included = createExchangesStream.included


describe('BTC Exchanges', function () {
  this.timeout(15 * 1000)

  const exchanges = createExchangesStream()


  it('Loads all included exchanges', function (done) {
    let counter = 0
    let found = []
    exchanges.subscribe((ex) => {
      found.push(ex.id)
      counter++
    },
      done,
      () => {
        included.forEach((ex) => {
          expect(found, 'to contain', ex)
        })
        done()
      }
    )
  })

  it('Finds bitfinex and has its symbols', (done) => {
    const bitfex = exchanges
      .filter(ex => ex.id === 'bitfinex')

    bitfex.subscribe((bitEx) => {
      expect(bitEx.symbols, 'to be ok')
      expect(bitEx.symbols, 'to contain', 'ETH/BTC')
    }, done, done)
  })

})


