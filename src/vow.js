const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function Vow(executor) {
  let state = PENDING;
  let value = undefined;

  if (typeof executor === "undefined") {
    throw new TypeError("Executor is missing.");
  }

  if (typeof executor !== "function") {
    throw new TypeError("Executor must be a function.");
  }

  let resolved = false;

  const resolve = (resolution) => {
    if (resolved) return;
  };

  const reject = (reason) => {
    if (resolved) return;

    if (state !== PENDING) {
      throw new Error("Pledge is already settled.");
    }
  };

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

module.exports = Vow;
