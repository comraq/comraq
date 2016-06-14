/**
 * @function getIterator
 * @param {iterable} target
 * - 
 */
export const getIterator = target => target[Symbol.iterator]();

export const reverse = iterable => {
  let result = [];
  for (const item of iterable)
    result.unshift(item);

  return result;
};

export const reduce = (
  func,
  acc,
  iterable,
  index = 0,
  iterator = getIterator(iterable)
) => {
  let item = iterator.next();
  if (item.done)
    return acc;

  acc = func(acc, item.value, index, iterable);
  return reduce(func, acc, iterable, index + 1, iterator);
};
