const Vow = require('./vow');

function deferred() {
  let resolve;
  let reject;

  return {
    promise: new Vow((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    }),
    resolve: resolve,
    reject: reject
  };
}

var resolved = function (value) {
  var d = deferred();
  d.resolve(value);
  return d.promise;
};

var dummy = { dummy: "dummy" };

describe("2.3.1: If `promise` and `x` refer to the same object, reject `promise` with a `TypeError' as the reason.", () => {
  it.only("via return from a fulfilled promise", function (done) {
    var promise = resolved(dummy).then(function () {
      return promise;
    });

    promise.then(null, function (reason) {
      expect(reason).toBeInstanceOf(TypeError);
      done();
    });
  });

  it("via return from a rejected promise", function (done) {
    var promise = rejected(dummy).then(null, function () {
      return promise;
    });

    promise.then(null, function (reason) {
      expect(reason).toBeInstanceOf(TypeError);
      done();
    });
  });
});
