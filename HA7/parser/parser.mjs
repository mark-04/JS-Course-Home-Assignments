'use strict';

import {
  isError,
  capturePR,
  ArithmeticExceptin,
  cons$P,
  satisfy$P, 
  map$P,  
  dropl$P,
  between$P,
  choice$P,
  some$P,
  many$P,
  option$P, 
  concat$P, 
  chainl1$P,
  char$P, 
  oneOf$P,
} from './parser-combinators.mjs';

const 
/** Calculations with higher than default precision **/
  PRECISION = 8,
  factor = Math.pow(10, PRECISION),
  makePrecise = (calc) => (x,y) => (Math.round(calc(x,y) * factor) / factor),
  addOp = makePrecise((x,y) => x+y),
  subtractOp = makePrecise((x,y) => x-y),
  multiplyOp = makePrecise((x,y) => x*y),
  divideOp = makePrecise((x,y) => {
    if (y === 0) {
      throw new ArithmeticExceptin('Arithmetic exception. Division by zero');
    };

    return x/y;
  }),
/** Regular Expressions **/   
  spaceRe = /\s/,
  notSpaceRe = /\S/,
  digitRe = /\d/,        
/** Arithmetic Parsers & Parser Combinators **/         
  space = satisfy$P((char) => spaceRe.test(char)),
  digit = satisfy$P((char) => digitRe.test(char)),
  token$P = (parser) => dropl$P(many$P(space), parser),
  unsignedInt = some$P(digit),
  positiveInt = dropl$P(char$P('+'), unsignedInt),
  negativeInt = concat$P(char$P('-'), unsignedInt),
  int = choice$P(unsignedInt, positiveInt, negativeInt),
  decimal = concat$P(char$P('.'), some$P(unsignedInt)),
  exponent = concat$P(oneOf$P("eE"), int),
  float = concat$P(int, decimal, option$P(exponent)),
  castNum$P = map$P(Number), 
  number = token$P(castNum$P(choice$P(float, int))),
  operator$P = (sym, func) => token$P(dropl$P(char$P(sym), cons$P(func))),
  add = operator$P('+', addOp),
  subtract = operator$P('-', subtractOp),
  multiply = operator$P('*', multiplyOp),
  divide = operator$P('/', divideOp),
  prec1Op = choice$P(multiply, divide), // Operators with first precedence 
  prec2Op = choice$P(add, subtract),    // Operators with second precedence
  leftParent = token$P(char$P('(')),
  rightParent = token$P(char$P(')')),
  inParents$P = (parser) => between$P(leftParent, parser, rightParent);

// The use of function declarations here is in order to levarage mutual recursion  
function expr(input) {  
  return chainl1$P(chainl1$P(subexpr, prec1Op), prec2Op)(input);
};

function subexpr(input) {
  return choice$P(inParents$P(expr), number)(input);
};

// Wrapper arround expression parser that returns printable result
// Returns an error message if some part of the input is left unparsed
const parse = (input) => {
  const parserR = capturePR(expr, input);

  if (isError(parserR)) {
    return parserR.message;
  };

  const {
    result,
    unparsed
  } = parserR;

  const leftUnparsedInput = notSpaceRe.test(unparsed);

  if (leftUnparsedInput) {
    return 'Error. Invalid expression';
  };

  return result;
};

export default parse;