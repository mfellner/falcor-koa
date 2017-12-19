# falcor-koa

[Falcor](https://netflix.github.io/falcor/) middleware for [Koa](https://github.com/koajs/koa/).
Inspired by [falcor-express](https://github.com/Netflix/falcor-express/).

## Installation

``` shell
$ yarn add falcor-koa
```

## Usage

With Router:

``` javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const FalcorRouter = require('falcor-router');
const { dataSourceRoute } = require('falcor-koa');

const router = new FalcorRouter([
  {
    route: 'test',
    get: () => ({
      path: ['test'],
      value: 'Hello Test'
    })
  }
]);

const app = new Koa();
app.use(bodyParser());
app.use(dataSourceRoute(router));
app.listen(3000);
```

With static model (for development purposes only):

``` javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { dataSourceRoute } = require('falcor-koa');

const sourceModel = new falcor.Model({
  cache: {
    todos: [
      {
        name: 'get milk from corner store',
        done: false
      },
      {
        name: 'withdraw money from ATM',
        done: true
      }
    ]
  }
}).asDataSource();

const app = new Koa();
app.use(bodyParser());
app.use(dataSourceRoute(sourceModel));
app.listen(3000);
```

## Development

Before contributing, please run the linter and the tests to be sure there are no issues.

``` shell
$ yarn run lint
```

and

``` shell
$ yarn run test
```

## License

[Apache License 2.0](https://github.com/mfellner/falcor-koa/blob/master/LICENSE)
