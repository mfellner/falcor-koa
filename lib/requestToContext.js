"use strict"

const ARGS = Object.freeze({
  jsonGraph: true,
  callPath: true,
  arguments: true,
  pathSuffixes: true,
  paths: true
});

module.exports = requestToContext;

function requestToContext(request) {
  const query = request.method === 'POST' ? request.body : request.query;
  return Object.entries(query).reduce(queryToContext, {});
}

function queryToContext(context, [key, argument]) {
  context[key] = (ARGS[key] && argument) ? JSON.parse(argument) : argument;
  return context;
}
