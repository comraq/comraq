import comraq from "./../src";
const {
  Transformer,
  isTransformer
} = comraq.functional.transducers;

export const numbersData = [ 1, 2, 3, 10, 0, -3 ];

export const namesData = [
  { name: "adam", type: "common name", id: 999 },
  { name: "comraq", type: "username", id: 111 },
  { name: "yin", type: "last name", id: 777 },
  { name: "yi ran", type: "first name", id: -3 }
];

export const array1 = [ true, false, null, "asdfg", 104 ];
export const array2 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ];

export const inc5 = value => value + 5;
export const inc10 = value => value + 10;
export const triple = value => value * 3;

export const even = value => value % 2 === 0;
export const positive = value => value > 0;

export const add = (valA, valB) => valA + valB;
export const subtract = (valA, valB) => valA - valB;

export const multiply = (a, b) => a * b;
export const getZero = () => 0;

export const toArray = (...args) => args;
export const addAll = (...vals) => vals.reduce(add);

export const getTrue = () => true;
export const getFalse = () => false;

export const arity1Add = a => b => c => d => e => a + b + c + d + e;
export const arity1SideEffect = a => {
  console.log(`a: ${a}`);

  return b => {
    console.log(`b: ${b}`);

    return c => {
      console.log(`c: ${c}`);

      return d => {
        console.log(`d: ${d}`);

        return e => {
          console.log(`e: ${e}`);

          return a + b + c + d + e;
        };
      };
    };
  };
};

export const stubTransformer = Transformer(() => {});
export const isTransducer = target =>
  isTransformer(target(stubTransformer));
