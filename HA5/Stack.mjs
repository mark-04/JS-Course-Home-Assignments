'use strict';

/** 
 *  Since lists and stacks are structurally very similar
 *  and share the same performance characteristics, 
 *  we'll use lists for stacks' internall representation 
 *  
 *  That way we can reuse code for the functinality
 *  that is shared between both data structures 
 **/ 

import List from './List.mjs';

class Stack {
  static fromIterable(iterable) {
    if (iterable[Symbol.iterator] === undefined) {
      throw new Error('Iterable expected')
    };

    let iterableSize = 0;

    for (let item of iterable) {
      iterableSize++
    };

    const stack = new Stack(iterableSize);

    for (let item of iterable) {
      stack.push(item)
    };

    return stack
  };

  #value; 
  #size;
  #maxSize;

  constructor(maxSize = 10) {
    this.#value   = new List();
    this.#size    = 0;
    this.#maxSize = maxSize;
  };

  push(element) {
    if (this.#size === this.#maxSize) {
      throw new Error('The stack is full')
    };

    this.#size += 1;
    this.#value.prepend(element);
  };

  pop() {
    if (this.#size === 0){
      throw new Error('The stack is empty')
    };

    this.#size -= 1;

    const poped = this.#value.head;
    
    this.#value = new List(this.#value.tail);

    return poped
  };

  peek() {
    if (this.#size === 0) {
      return null
    };

    return this.#value.head
  };

  isEmpty() {
    return this.#size === 0
  };
  
  toArray() {
    return this.#value.toArray()
  };
};

export default Stack;