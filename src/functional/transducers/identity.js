import {
  step, complete, init,
  default as Transformer,
  isTransformer
} from "./Transformer";

/**
 * @public @function identity
 * - transducer version of the identity function
 *
 * @param {Transformer} target
 * - the target instance with the Transformer mixin
 *
 * @return {Transformer}
 * - the id transformer that will call target as the next transformer
 *   accordingly
 *
 * @throws TypeError
 * - if target is not an instance with the Transformer mixin
 */
export default target => {
  if (!isTransformer(target))
    throw new TypeError(
      `Non-transformer ${target} is supplied to identity Transducer!`
    );

  return Transformer(
    (acc, next, ...args) =>
      step(target, acc, next, ...args),

    acc => complete(target, acc),

    () => init(target)
  );
};
