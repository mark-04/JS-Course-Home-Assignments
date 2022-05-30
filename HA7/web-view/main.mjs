'use strict';

import parse from '../parser/parser.mjs';

class Calculator {
  #display;
  #displayViewRef;
  #isCleanupScheduled;

  constructor(displayViewRef) {
    this.#display = '';
    this.#isCleanupScheduled = false;
    this.#displayViewRef = displayViewRef;
  };

  set display(text) {
    this.#display = text;
    this.#displayViewRef.update(text);
  };

  type(text) {
    if (this.#isCleanupScheduled) {
      this.display = '';
      this.#isCleanupScheduled = false;
    };

    this.display = this.#display.concat(text);
  };

  clear() {
    this.display = '';
  };

  clearOne() {
    if (this.#display.length <= 1 || this.#isCleanupScheduled) {
      this.display = '';
      return
    };

    this.display = this.#display.slice(0, -1);
  };

  calculate() {
    if (this.#display === '') {
      return;
    };

    const result = parse(this.#display);
    const isError = (typeof result === 'string');

    if (isError) {
      this.display = result;
      this.#isCleanupScheduled = true;
    };

    this.display = String(result);
  };
};

const calculatorDisplay = document.getElementById('calculator__display');
const calculator = new Calculator({
  update(text) {
    calculatorDisplay.innerText = text;
  }
});

document.getElementById('clear').addEventListener('click', (() => calculator.clear()));
document.getElementById('clear-one').addEventListener('click', (() => calculator.clearOne()));
document.getElementById('calculate').addEventListener('click', (() => calculator.calculate()));

const calculatorButtons = [
  ['left-paren', '('],
  ['right-paren', ')'],

  ['zero', '0'],
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
  ['dot', '.'],

  ['divide', '/'],
  ['multiply', '*'],
  ['subtract', '-'],
  ['add', '+']
];

for (let [id, char] of calculatorButtons) {
  document.getElementById(id).addEventListener('click', (() => calculator.type(char)));
};