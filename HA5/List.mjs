'use strict';

const isEmpty = (list) => list === null;

const append = (list, element) => {
  if (isEmpty(list)) {
    return {head: element, tail: list}
  };

  return {head: list.head, tail: append(list.tail, element)}
};

const prepend = (list, element) => ({head: element, tail: list});

const find = (list, element) => {
  if (isEmpty(list)) {
    return null
  } else if (list.head === element) {
    return element
  } else {
    return find(list.tail, element)
  }
};

const toArray = (list, result = []) => {
  if (isEmpty(list)) {
    return result
  };

  result[result.length] = list.head;

  return toArray(list.tail, result)
};

class List {
  static fromIterable(iterable) {
    if (iterable[Symbol.iterator] === undefined) {
      throw new Error('Iterable structure expected')
    };

    let list = new List();
    for (let element of iterable) {
      list.prepend(element) 
    };

    return list
  };

  #value;

  constructor(list = null) {
    this.#value = list
  };

  get head() {
    if (this.#value === null) {
      throw new Error('Cannot take the head of an empty list')
    };

    return this.#value.head
  };

  get tail() {
    if (this.#value === null) {
      throw new Error('Cannot take the tail of an empty list')
    };

    return this.#value.tail
  };

  append(element) { /* O(n). 
    If you need a collection with efficient insertions to the end 
    use arrys instead */

    this.#value = append(this.#value, element)
  };

  prepend(element) { // O(1)
    this.#value = prepend(this.#value, element)
  };

  find(element) {
    return find(this.#value, element)
  };

  toArray() {
    return toArray(this.#value)
  };
};

export default List;