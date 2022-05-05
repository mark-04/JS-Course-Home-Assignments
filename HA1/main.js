'use strict';

const ERROR_MESSAGE = 'Некорректный ввод!';

// Main function is curried in order to allow partial application 
// and thus enable injecting different computations for different tasks
function main(computation) {
  return function() {
    const inputs = coerceEach(Number, getInputs());

    if (allValid(inputs)) {
      const result = computation(...inputs);
      console.log(result);
    } else {
      console.log(ERROR_MESSAGE)
    }
  }
}

document.getElementById('first-task').addEventListener('click', main(numberWithRadix));
document.getElementById('second-task').addEventListener('click', main(sumAndDivide));


// Auxiliary functions:

function getInputs() {
  return [prompt(), prompt()];
} 

function coerceEach(coercingFn, values) {
  return values.map(coercingFn)
} 

function allValid(inputs) {
  const result = inputs
    .map((value) => !(Number.isNaN(value))) 
    .reduce((accumulator, input) => accumulator && input, true);

  return result
} 

function numberWithRadix(number, radix) {
  return Number(number.toString(radix)); 
} 

function sumAndDivide(first, second) {
  return `Ответ: ${first + second}, ${first / second}.`;
} 