/**!
 * falcor-koa - index.js
 * Copyright(c) 2015
 * Released under the Apache-2.0 license
 *
 * Authors:
 * mfellner <max.fellner@gmail.com>
 */
import url from 'url'

const parseArgs = Object.freeze({
  jsonGraph: true,
  callPath: true,
  arguments: true,
  pathSuffixes: true,
  paths: true
})

function requestToContext(req) {
  const queryMap = req.method === 'POST' ? req.body : url.parse(req.url, true).query;
  const context = {}

  if (queryMap) {
    Object.keys(queryMap).forEach(key => {
      let arg = queryMap[key]

      if (parseArgs[key] && arg) {
        context[key] = JSON.parse(arg)
      } else {
        context[key] = arg
      }
    })
  }
  return Object.freeze(context)
}

export function dataSourceRoute(dataSource) {
  return function(ctx, next) {
    if (!dataSource) {
      ctx.throw('Undefined data source', 500);
    }

    const falcorContext = requestToContext(ctx.request)

    if (Object.keys(falcorContext).length === 0) {
      ctx.throw('Request not supported', 500);
    }
    if (!falcorContext.method || !falcorContext.method.length) {
      ctx.throw('No query method provided', 500)
    }
    if (!dataSource[falcorContext.method]) {
      ctx.throw(`Data source does not implement method ${falcorContext.method}`, 500)
    }

    const observable = {
      'set': () => dataSource[falcorContext.method](falcorContext.jsonGraph),
      'call': () => dataSource[falcorContext.method](falcorContext.callPath, falcorContext.arguments, falcorContext.pathSuffixes, falcorContext.paths),
      'get': () => dataSource[falcorContext.method]([].concat(falcorContext.paths || [])),
      'undefined': () => ctx.throw(`Unsupported method ${falcorContext.method}`, 500)
    }[falcorContext.method]()

    // Note: toPromise could be removed in the future (https://github.com/Netflix/falcor/issues/464)
    observable.subscribe(function(jsonGraphEnvelope) {
      ctx.body = jsonGraphEnvelope
    }, function(err) {
      if (err instanceof Error) {
        return next(err)
      }
      ctx.status = 500
      ctx.body = err
    })
  }
}
