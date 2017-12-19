"use strict"

const dataSourceRoute = require('../lib');
const request = require('supertest');

const Router = require('falcor-router');
const Koa = require('koa');

describe('dataSourceRoute', () => {
  const router = new Router([
    {
      route: 'test',
      get: () => ({
        path: ['test'],
        value: 'Hello Test'
      })
    }
  ]);

  const app = new Koa();
  app.use(dataSourceRoute(router));
  const server = app.listen();

  it('should return the JSON Graph', async () => {
    const response = await request(server).get('/todo?paths=[[%22test%22]]&method=get');

    expect(response.statusCode).toBe(200);
    expect(response.get('Content-Type')).toBe('application/json; charset=utf-8');
    expect(response.text).toBe(JSON.stringify({
      "jsonGraph": {
        "test": "Hello Test"
      }
    }));

    server.close();
  });
});
