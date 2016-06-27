/**
 * @public @const
 * - string constants for type checking when called with
 *   Object.prototype.toString.call(target)
 *
 * @see @public @function toString
 */
export const tString              = "[object String]";
export const tNumber              = "[object Number]";
export const tArray               = "[object Array]";
export const tObject              = "[object Object]";
export const tFunction            = "[object Function]";
export const tNull                = "[object Null]";
export const tUndefined           = "[object Undefined]";
export const tBoolean             = "[object Boolean]";
export const tDate                = "[object Date]";
export const tJson                = "[object JSON]";
export const tMap                 = "[object Map]";
export const tSet                 = "[object Set]";
export const tGeneratorObject     = "[object Generator]";
export const tGeneratorFunction   = "[object GeneratorFunction]";

/**
 * @public @function toString
 * - an precise way to identitfy the specific type of an instance target
 *
 * @link http://tobyho.com/2011/01/28/checking-types-in-javascript/
 */
export const toString = target => Object.prototype.toString.call(target);
