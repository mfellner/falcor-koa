"use strict"

const observableToPromise = module.exports = observable => new Promise((resolve, reject) => {
  observable.subscribe(data => resolve(JSON.stringify(data)), reject);
});
