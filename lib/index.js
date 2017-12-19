"use strict"

const observableToPromise = require('./observableToPromise');
const requestToContext = require('./requestToContext');

const FalcorEndpoint = module.exports = {};

FalcorEndpoint.dataSourceRoute = dataSource => async context => {
  if (!dataSource) context.throw(500, 'Data source was not defined');

  // To ensure compatibility with original implementation
  if (typeof dataSource === 'function') {
    if (dataSource.length > 1) {
      console.log('supplied "getDataSource" function accepts too many arguments');
      context.throw(500, 'Data source is invalid');
    }

    dataSource = dataSource(context);
  }

  const falcorContext = requestToContext(context.request);
  if (!Object.keys(falcorContext).length) context.throw(400, 'Request not supported');

  const { method } = falcorContext;
  if (typeof method !== 'string' || !method.length) {
    context.throw(400, 'No query method provided');
  }
  if (typeof dataSource[method] !== 'function') {
    context.throw(501, `Data source does not implement "${method}" method`);
  }

  let observable;

  // Using switch here since different methods take different arguments
  // @TODO: research alternatives that can be set on initialization
  switch (method) {
    case 'call':
      const { callPath, arguments: args, pathSuffixes, paths } = falcorContext;
      observable = dataSource.call(callPath, args, pathSuffixes, paths);
    break;
    case 'get':
      observable = dataSource.get([].concat(falcorContext.paths));
    break;
    case 'set':
      observable = dataSource.set(falcorContext.jsonGraph);
    break;
    default:
      context.throw(400, `"${falcorContext.method}" is not a valid data source method`);
    break;
  }

  try {
    const payload = await observableToPromise(observable);
    context.response.type = 'application/json';
    context.response.body = payload;
  } catch (error) {
    if (error instanceof Error) return context.throw(500, error.message);
    if (typeof error === 'string') return context.throw(500, error);

    // This should technically never happen but you cannot be too cautious
    context.throw(500, 'Unexpected error has occured in the data source');
    console.log('Unexpected internal server error has occured:');
    console.dir(error);
  }
}
