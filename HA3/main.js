'use strict';

/*--------+
| Task #1 |
+--------*/

Array.prototype.myFilter = function(callback, context) {
  const predicate = (context ? callback.bind(context) : callback);

  return this.reduce((accumulator, value, index, array) => {
    if (predicate(value, index, array)) {
      accumulator.push(value);
    };

    return accumulator
  }, [])
};


/*--------+
| Task #2 |
+--------*/

const createDebounceFunction = (callback, delay) => {
  let isScheduled = false; 
  let timeoutID = 0;
  
  return function() {
    if (isScheduled) {
      clearTimeout(timeoutID)
    };

    isScheduled = true;
    timeoutID = setTimeout(callback, delay);
  }
};