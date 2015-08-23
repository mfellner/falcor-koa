var Koa = require('koa');
var FalcorRouter = require('falcor-router');
var falcorKoa = require('../../falcor-koa');
var app = Koa();

app.use(falcorKoa.dataSourceRoute(new FalcorRouter([{
  route: 'greeting',
  get: function() {
    return {
      path: ['greeting'],
      value: 'Hello World!'
    }
  }
}])));

app.listen(3000);
