const isThenable = obj =>
  typeof obj === 'object' && typeof obj.then === 'function';

/**
 * Handles calling success and error callbacks once for when a function (`fn`) can return a promise or use callbacks.
 * @param {Object} options
 * @param {(...args: any[], onSuccess: () => {}, onError: () => {}) => any} options.fn The function to call asynchronously. Should accept onSuccess and onError callbacks as its last two params.
 * @param {Array} options.args Arguments to pass to `fn` before the onSuccess and onError params.
 * @param {Function} options.success Callback to run on success of `fn`. Whatever is returned from `options.success` will be the result of the promise.
 * @param {Function} options.error Callback to run on error of `fn`.
 */
const callbackOrPromise = ({
  fn,
  args = [],
  success = () => {},
  error = () => {}
}) =>
  new Promise((resolve, reject) => {
    let handledSuccess = false;
    let handledError = false;

    const onSuccess = res => {
      if (!handledSuccess) {
        handledSuccess = true;
        const resolveWith = success(res);
        resolve(resolveWith);
        return resolveWith;
      }
    };

    const onError = err => {
      if (!handledError) {
        handledError = true;
        const rejectWith = error(err);
        reject(rejectWith);
      }
    };

    const result = fn(...args, onSuccess, onError);

    if (isThenable(result)) {
      result.then(onSuccess).catch(onError);
    }
  });

export default callbackOrPromise;
