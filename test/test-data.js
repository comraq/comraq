import composable from "./../src/functional/composable";

export const numbersData = [ 1, 2, 3, 10, 0, -3 ];

export const namesData = [
  { name: "adam", type: "common name", id: 999 },
  { name: "comraq", type: "username", id: 111 },
  { name: "yin", type: "last name", id: 777 },
  { name: "yi ran", type: "first name", id: -3 }
];

export const inc10 = composable(value => value + 10);
export const triple = composable(value => value * 3);

export const even = composable(value => value % 2 === 0);
export const positive = composable(value => value > 0);

export const add = composable((valA, valB) => valA + valB);
export const subtract = composable((valA, valB) => valA - valB);
export const upper = composable(e => e.toUpperCase());

export const multiply = (a, b) => a * b;
export const getZero = () => 0;

export const addAll = (...vals) => vals.reduce(add);
