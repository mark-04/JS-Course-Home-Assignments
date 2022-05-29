'use strict';

import repl from 'node:repl';
import parse from './parser.mjs';

const evalX = (expression, context, filename, callback) => { 
  callback(null, parse(expression));
};

repl.start({ prompt: '> ', eval: evalX });