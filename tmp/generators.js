let comraq = require("./../dist/comraq");

let { compose } = comraq.functional;
let { isString, isNumber } = comraq.utils.checks;

let map;
exports.map = map = func => it => (function* () {
  console.log(`map: ${it}`);
  for (const i of it)
    yield func(i);
})();

let filter;
exports.filter = filter = pred => it => (function* () {
  console.log(`filter: ${it}`);
  for (const i of it)
    if (pred(i))
      yield i;
})();

let reduce;
exports.reduce = reduce = reducer => acc => it => {
  let i = 0;
  for (const e of it) {
    acc = reducer(acc, e, i++, it);
  }

  return acc;
};

exports.arr = [ "a", "b", "c", "d", "e", true, false, null, 123, 456 ];

exports.comraq = comraq;

let func;
exports.func = func = e => {
  console.log(`func: ${e}`);
  return e + 1;
};

let pred;
exports.pred = pred = e => {
  console.log(`pred: ${e}`);
  return isString(e) || isNumber(e);
};

let map1, fil1;
exports.map1 = map1 = map(func);
exports.fil1 = fil1 = filter(pred);

exports.combined = array => map1(fil1(array));

exports.c2 = compose(map1, fil1);
