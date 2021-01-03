const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function isCallable(fn) {
  return typeof fn === 'function';
}

function isObject(obj) {
  return ((typeof obj === "object") && (obj !== null)) || isCallable(obj);
}

function Vow(executor) {
  let id = this;
  let queue = [];
  let state = PENDING;
  let value = undefined;

  function reject(reason) {
    state = REJECTED;
    value = reason;
    queue.forEach(cb => cb(value));
  }

  function fulfill(resolution) {
    if (isObject(resolution)) {
      let thenable;

      if (Object.is(id, resolution.id)) {
        reject(new TypeError('Cannot resolve self.'));
        return;
      }

      try {
        thenable = resolution.then;
      } catch (reason) {
        reject(reason);
        return;
      }

      if (isCallable(thenable)) {
        settle(thenable.bind(resolution));
        return;
      }
    }

    state = FULFILLED;
    value = resolution;
    queue.forEach(cb => cb(value));
  }

  function settle(fn) {
    let settled = false;

    try {
      fn(
        (resolution) => {
          if (settled) return;
          settled = true;
          fulfill(resolution);
        },
        (reason) => {
          if (settled) return;
          settled = true;
          reject(reason);
        }
      );
    } catch (reason) {
      if (state === FULFILLED) return;
      reject(reason);
    }
  }

  settle(executor);

  return {
    id,

    state,

    then(onFulfilled, onRejected) {
      return new Vow((res, rej) => {
        function resolve(resolution) {
          setImmediate(() => {
            if (state === FULFILLED && !isCallable(onFulfilled)) {
              res(value);
              return;
            }

            if (state === REJECTED && !isCallable(onRejected)) {
              rej(value);
              return;
            }

            const fn = state === FULFILLED ? onFulfilled : onRejected;

            try {
              res(fn(resolution));
            } catch (reason) {
              rej(reason);
            }
          })
        }

        if (state === PENDING) {
          queue.push(resolve);
          return;
        }

        resolve(value);
      });
    },

    value,
  };
}

module.exports = Vow;
