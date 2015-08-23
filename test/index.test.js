/**!
 * falcor-koa - index.js
 * Copyright(c) 2015
 * Released under the Apache-2.0 license
 *
 * Authors:
 * mfellner <max.fellner@gmail.com>
 */
import request from 'supertest'
import koa from 'koa'
import should from 'should'
import FalcorRouter from 'falcor-router'

import { dataSourceRoute } from '../lib'

describe('dataSourceRoute', () => {

  const app = koa()
  app.use(dataSourceRoute(new FalcorRouter([{
    route: 'test',
    get: function() {
      return {
        path: ['test'],
        value: 'Hello Test'
      }
    }
  }])))

  it('should return the JSON Graph', done => {
    request(app.listen())
      .get('/todo?paths=[[%22test%22]]&method=get')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        "jsonGraph": {
          "test": "Hello Test"
        }
      })
      .end(done)
  })
})
