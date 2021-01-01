const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function Vow(executor) {
  let resolved = false;
  let state = PENDING;
  let value = undefined;

  if (typeof executor === "undefined") {
    throw new TypeError("Executor is missing.");
  }

  if (typeof executor !== "function") {
    throw new TypeError("Executor must be a function.");
  }

  const reject = (reason) => {
    if (resolved) return;

    if (state !== PENDING) {
      throw new Error("Promise is already settled.");
    }

    resolved = true;
    state = REJECTED;
    value = reason;
  };


  const resolve = (resolution) => {
    if (resolved) return;

    if (Object.is(this, resolution)) {
      reject(new TypeError("Cannot resolve self."));
    }

    resolved = true;
  };

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }

  return {
    then(onFulfilled, onRejected) {
      return new Vow((res, rej) => {

      });
    }
  }
}

module.exports = Vow;
