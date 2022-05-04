'use strict';

const ERROR_MESSAGE = 'Некорректный ввод!';

function getInputs() {
  return [prompt(), prompt()];
} 

function coerceEach(coercingFn, values) {
  values.map(coercingFn)
} 

function allValid(inputs) {
  const result = inputs
    .map((value) => !(Number.isNaN(value)) 
    .reduce((accumulator, input) => accumulator && input);

  return result
} 

function numberWithRadix(number, radix) {
  return Number(number.toString(radix)); 
} 

function sumAndDivide(first, second) {
  return `Ответ: ${first + second}, ${first / second}.`;
} 

function main(computation) {
  const inputs = coerceEach(Number, getInputs());

  if (allValid(inputs)) {
    const result = computation(...inputs);
    console.log(result);
  } else {
    console.log(ERROR_MESSAGE)
  }
}
