'use strict';

import repl from 'node:repl';
import { capturePR, isError } from './parser/parser-combinators.mjs';
import parse from './parser/parser.mjs';

const notWhiteSpaceRe = /\S/;

// Extracts result from a parser return value
// that is reasonable to print in the terminal  
const getResult = (parserR) => {
  if (isError(parserR)) {
    return parserR.message;
  };

  const {
    result,
    unparsed
  } = parserR;

  const leftUnparsedInput = notWhiteSpaceRe.test(unparsed);

  if (leftUnparsedInput) {
    return 'Error. Invalid expression';
  };

  return result;
};

const evalX = (expression, context, filename, callback) => { 
  const parserR = capturePR(parse, expression);

  callback(null, getResult(parserR));
};

repl.start({ prompt: '> ', eval: evalX });