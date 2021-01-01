const Vow = require("./vow");

module.exports = {
  Promise: Vow,
  deferred() {
    let resolve;
    let reject;

    return {
      promise: new Vow(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
      }),
      resolve: resolve,
      reject: reject
    };
  }
};
