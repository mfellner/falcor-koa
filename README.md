# falcor-koa

[Falcor](https://netflix.github.io/falcor/) middleware for [Koa](https://github.com/koajs/koa/).
Inspired by [falcor-express](https://github.com/Netflix/falcor-router/).

***Experimental, do not use in prodcution!***

### Usage

```javascript
var Koa = require('koa');
var FalcorRouter = require('falcor-router');
var falcorKoa = require('falcor-koa');
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
```
