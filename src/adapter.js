const Vow = require('./vow');

module.exports = {
  deferred() {
    let resolve;
    let reject;

    return {
      promise: new Vow((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      }),
      resolve,
      reject,
    };
  },
};
