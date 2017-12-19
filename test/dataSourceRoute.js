"use strict"

const { dataSourceRoute } = require('../lib');
const request = require('supertest');

const bodyParser = require('koa-bodyparser');
const Router = require('falcor-router');
const Koa = require('koa');

describe('dataSourceRoute', function () {
  const router = new Router([
    {
      route: 'test',
      get: pathSet => ({
        path: ['test'],
        value: 'get method has called'
      })
    }
  ]);

  const app = new Koa();
  app.use(bodyParser());
  app.use(dataSourceRoute(router));
  const server = app.listen();

  describe('Can interact with data correctly', function () {
    it('Calls get method', async () => {
      const response = await request(server).get('/?paths=[[%22test%22]]&method=get');

      expect(response.statusCode).toBe(200);
      expect(response.get('Content-Type')).toBe('application/json; charset=utf-8');
      expect(response.body).toEqual({
        jsonGraph: {
          test: 'get method has called'
        }
      });
    });

    it('Calls set method', async () => {
      const response = await request(server).post('/').send({
        jsonGraph: '{"genrelist":{"0":{"titles":{"0":{"name":"jon"}}}},"paths":[["genrelist",0,"titles",0,"name"]]}',
        method: 'set'
      });

      expect(response.statusCode).toBe(200);
      expect(response.get('Content-Type')).toBe('application/json; charset=utf-8');
      expect(response.body).toEqual({
        jsonGraph: {
          genrelist: { 0: {
            titles: { 0: {
              name: { $type: 'atom' }
            } }
          } }
        }
      });
    });
  });

  afterAll(() => server.close());
});
