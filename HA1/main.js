'use strict';

const getInputs  = () => [prompt(), prompt()]; 
const coerceEach = (coercingFn, array) => array.map(coercingFn);
const allValid   = (array) => (
  array
    .map((value) => !(Number.isNaN(value)))
    .reduce((fst, snd) => fst && snd, true)
);

const numberWithRadix = (number, radix) => Number(number.toString(radix));
const sumAndDivide    = (first, second) => `Ответ: ${first + second}, ${first / second}.`;

const main = (computation) => {
  const inputs = coerceEach(Number, getInputs());

  if (allValid(inputs)) {
    const result = computation(...inputs);
    console.log(result);
  } else {
    console.log('Некорректный ввод!')
  }
};
