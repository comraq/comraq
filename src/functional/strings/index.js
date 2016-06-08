import { currify } from "./../curry";

export const length = s => s.length;

export const repeat = currify((count, s) => s.repeat(count));

export const replace = currify(
  (expr, replacement, s) => s.replace(expr, replacement)
);

export const split = currify((sep, s) => s.split(sep));

export const lower = s => s.toLowerCase();

export const upper = s => s.toUpperCase();

export const trim = s => s.trim();
