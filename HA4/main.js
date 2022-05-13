'use strict';

/*------------+
|   Task #1   |
+------------*/ 


function concatStrings(string, sep) {
  const result = [string];
  const separator = (typeof sep === 'string' ? sep : '');

  return function closure(input) {
    if (typeof input !== 'string') {
      return result.join(separator)
    };
    
    result[result.length] = input;

    return closure
  }
};


/*------------+
|   Task #2   |
+------------*/ 

const invalidNumber = (num) => (
  typeof num !== 'number' ||
  Number.isNaN(num)       ||
  num === Infinity        ||
  num === -Infinity       
);

class Calculator {
  #x;
  #y;

  constructor(x, y) {
    if (invalidNumber(x) || invalidNumber(y)) {
      throw new Error('Invalid input. Numbers expected')
    };

    this.#x = x;
    this.#y = y;
  };

  setX = (val) => {
    if (invalidNumber(val)) {
      throw new Error('Invalid input. Number expected')
    };

    this.#x = val;
  };

  setY = (val) => {
    if (invalidNumber(val)) {
      throw new Error('Invalid input. Number expected')
    };

    this.#y = val;
  };

  logSum = () => {
    console.log(this.#x + this.#y)
  };

  logMul = () => {
    console.log(this.#x * this.#y)
  };

  logSub = () => {
    console.log(this.#x - this.#y)
  };

  logDiv = () => {
    if (this.#y === 0) {
      throw new Error('Division by zero')
    };

    console.log(this.#x / this.#y)
  };
};