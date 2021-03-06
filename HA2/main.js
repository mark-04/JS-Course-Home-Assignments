'use strict';

/*------------+
|   Task #1   |
+------------*/ 

   
// Same as Object.entries(), except works the same for both objects and arrays
const entries = (collection) => {
  if (Array.isArray(collection)) {
    const entries = [];
    collection.forEach((value, index) => entries[index] = [index, value]);

    return entries
  } else {
    return Object.entries(collection)
  }
};

// Works for both objects and arrays
const deepCopy = (value) => {
  if (value === null || typeof value !== 'object') {
    return value
  } else {
    const empty = (Array.isArray(value) ? [] : {});
    const result = entries(value).reduce((acc, [key, val]) => {
      acc[key] = deepCopy(val);
      return acc
    }, empty); 
    
    return result
  }
};


/*------------+
|   Task #2   |
+------------*/ 


const sortAscending = (arr) => arr.sort((a,b) => a === b ? 0 : (a < b ? -1 : 1));

const selectFromInterval = (numbers, ...bounds) => {
  const isValidInput = (
    Array.isArray(numbers) &&
    numbers.every((element) => typeof element === 'number') &&
    bounds.every((element) => typeof element === 'number')
  );

  if (isValidInput) {
    const [lowerBound, upperBound] = sortAscending(bounds);

    return numbers.filter((element) => element >= lowerBound && element <= upperBound);
  } else {
    throw new Error('Invalid input!');
  }
};


/*------------+
|   Task #3   |
+------------*/ 


class RangeIterator {
  constructor(from, to) {
    const isValid = (
      typeof from === 'number' &&
      typeof to   === 'number' &&
      from < to
    );

    if (isValid) {
      this.from = from;
      this.to = to;
    } else {
      throw new Error('Invalid range!')
    }
  };

  [Symbol.iterator]() {
    let current = this.from;

    return { 
      next: () => {
        if (current <= this.to) {
          return {value: current++, done: false}
        } else {
          current = this.from;

          return {done: true}
        } 
      }
    };
  };
};

const myIterator = new RangeIterator(1, 5);
const myRange = [...myIterator];