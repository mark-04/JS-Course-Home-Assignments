'use strict';

// NOTE  on naming conventions.
//       All parser combinators are suffixed with `$P`

// Types for possible parser errors
export class ParserError extends Error {
  constructor (message, options) {
    super(message, options);
  };
};

export class ArithmeticExceptin extends Error {
  constructor (message, options) {
    super(message, options);
  };
};

// RUNS  a function in try/catch blocks
//  AND  returns either the result of the call 
//   OR  the ParserError
//   OR  the ArithmeticExceptin
// USED  to unify ParserErrors and undefined behaviours
//       (handle corner cases)
export const capturePR = (func, ...args) => {
  try {
    return func(...args);
  } catch (err) {
    const isParserError = (
      err instanceof ParserError ||
      err instanceof ArithmeticExceptin
    );

    if (isParserError) {
      return err;
    };

    return new ParserError('Error. Invalid expression');
  };
}

//   SAME  as `Array.prototype.reduce`
// ECXEPT  works with any iterable
//    AND  can be interrupted
const reduce = (
  terminationCondition, 
  reducer, 
  initialVal, 
  iterable
) => {
  let result = initialVal;

  for (let item of iterable) {
    result = reducer(result, item);

    if (terminationCondition(result)) {
      return result;
    };
  };

  return result;
};

const isEmpty = (ent) => ent.length === 0;
export const isError = (ent) => (
  ent instanceof ParserError ||
  ent instanceof ArithmeticExceptin
);

export const cons$P = (val) => (input) => ({result: val, unparsed: input});

export const item$P = (input) => {
  if (isEmpty(input)) {
    throw new ParserError('Error. End Of Input');
  };

  const result = input[0];
  const unparsed = input.slice(1);

  return cons$P(result)(unparsed);
};

export const satisfy$P = (pred) => (input) => {
  const parserR = capturePR(item$P, input);

  if (isError(parserR)) {
    return parserR;
  };

  const {result} = parserR;

  if (pred(result)) {
    return parserR;
  };

  throw new ParserError('Error. Unexpected token: ' + result);
};

export const char$P = (char) => satisfy$P((inputChar) => inputChar === char);

export const oneOf$P = (str) => satisfy$P((it) => str.includes(it));

export const map$P = (mapper) => (parser) => (input) => {
  const parserR = capturePR(parser, input);

  if (isError(parserR)) {
    return parserR;
  };

  const {result, unparsed} = parserR;

  return cons$P(mapper(result))(unparsed);
};

export const dropl$P = (lParser, rParser) => (input) => {
  const firstResult = capturePR(lParser, input);

  if (isError(firstResult)) {
    return firstResult;
  };

  const {unparsed} = firstResult;
  
  return capturePR(rParser, unparsed);
};

export const dropr$P = (lParser, rParser) => (input) => {
  const firstParserR = capturePR(lParser, input);

  if (isError(firstParserR)) {
    return firstParserR;
  };

  const {
    result: firstResult,
    unparsed: firstUnparsed,
  } = firstParserR;

  const secondParserR = capturePR(rParser, firstUnparsed);

  if (isError(secondParserR)) {
    return secondParserR;
  };

  const {
    unparsed: secondUnparsed,
  } = secondParserR;

  return cons$P(firstResult)(secondUnparsed);
};

export const between$P = (lParser, midParser, rParser) => dropl$P(lParser, dropr$P(midParser, rParser));

export const either$P = (parserA, parserB) => (input) => {
  const firstResult = capturePR(parserA, input);

  if (isError(firstResult)) {
    const secondResult = capturePR(parserB, input);

    if (isError(secondResult)) {
      const errorA = firstResult.message;
      const errorB = secondResult.message;
      const isSameError = errorA === errorB;

      // dedupliacte errors 
      if (isSameError) {
        return firstResult;
      };

      // merge errors
      return new Error(errorA + '\n' + errorB)
    };

    return secondResult;
  };

  return firstResult;
};

export const option$P = (parser) => either$P(parser, cons$P(''));

export const many$P = (parser) => (input) => {
  let accumulator = '';
  const closure = (input) => {
    const currentR = cons$P(accumulator)(input);
    const nextR = capturePR(parser, input);

    if (isError(nextR)) {
      return currentR;
    };

    const {
      result: nextParserResult,
      unparsed
    } = nextR;

    accumulator = accumulator.concat(nextParserResult);

    return closure(unparsed);
  };

  return closure(input);
};

export const some$P = (parser) => (input) => {
  const firstParserR = capturePR(parser, input);

  if (isError(firstParserR)) {
    return firstParserR;
  };

  const {
    result: firstResult, 
    unparsed: firstUnparsed
  } = firstParserR; 

  const secondParserR = many$P(parser)(firstUnparsed);

  if (isError(secondParserR)) {
    return firstParserR;
  };

  const {
    result: secondResult,
    unparsed: secondUnparsed
  } = secondParserR;

  const finalResult = cons$P(firstResult.concat(secondResult))(secondUnparsed);

  return finalResult;
};

export const choice$P = (...parsers) => parsers.reduce((pA, pB) => either$P(pA, pB));

const pipePReducer = (combiner) => (firstParserR, secondParser) => {
  if (isError(firstParserR)) {
    return firstParserR;
  };

  const {
    result: firstResult, 
    unparsed: firstUnparsed
  } = firstParserR;

  const secondParserR = capturePR(secondParser, firstUnparsed);

  if (isError(secondParserR)) {
    return secondParserR;
  };

  const {
    result: secondResult, 
    unparsed: secondUnparsed
  } = secondParserR;

  const combinedResult = combiner(firstResult, secondResult);

  return cons$P(combinedResult)(secondUnparsed);
};

export const pipe$P = (combiner, firstParser) => 
              (...parsers) => 
              (input) => 
              reduce(isError, pipePReducer(combiner), firstParser(input), parsers);

export const concat$P = pipe$P((str1, str2) => str1.concat(str2), cons$P(''));


const chainl1Helper = (firstOperand, operatorP, operandP, input) => {
  const operatorR = capturePR(operatorP, input);

  if (isError(operatorR)) {
    return cons$P(firstOperand)(input);
  };

  const {
    result: operator,
    unparsed: unparsedOperand,
  } = operatorR;

  const secondOperandR = capturePR(operandP, unparsedOperand);

  if (isError(secondOperandR)) {
    return cons$P(firstOperand)(input);
  };

  const {
    result: secondOperand,
    unparsed
  } = secondOperandR;

  const result = operator(firstOperand, secondOperand);

  return chainl1Helper(result, operatorP, operandP, unparsed);
};

export const chainl1$P = (operandP, operatorP) => (input) => {
  const firstOperandR = capturePR(operandP, input);

  if (isError(firstOperandR)) {
    return firstOperandR;
  };

  const {
    result: firstOperand,
    unparsed
  } = firstOperandR;

  return chainl1Helper(firstOperand, operatorP, operandP, unparsed);
}; 