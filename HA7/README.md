# Calculator
The implementation is inspired by the seminal 1998 paper [Monadic parsing in Haskell
](https://www.cs.tufts.edu/comp/150FP/archive/graham-hutton/monadic-parsing-jfp.pdf).

You can start a REPL (interactive evaluator) by typing `node './parser/repl.mjs'` in your terminal (given this folder is your current working directory).

## About the calculator

Order of operations is standart (multiplication and division happens before addition and substraction):
```
> 3 + 2 * 2
7
```
Order of operations can be changed by enclosing the expression in parentheses:
```
> (3 + 2) * 2
10
```
Subexpressions (expressions enclosed in parentheses) can be arbitrarily nested: 
```
> (100 / (100 / (4 / (2))))
2
```
The use of signed numbers is supported. And so you can type expressions like:
```
> +3+-2*-7+3
20
```
White spaces are ignored. And so, in order to make the previous example more readable, we can rewrite it as follows:
```
> +3 + -2 * -7 + 3
20
```
Note, howevere, that for signed numbers the sign must be immediately followed by the number. For example, the following is a valid expression:
```
> 3 + -3
0
```
whereas, the next one is not:
```
> 3 + - 3
'Error. Invalid expression'
```
Division by zero is disallowed: 
```
> 5 / 0
'Arithmetic exception. Division by zero'
```

Some more examples:
```
> 5.7e+4 * 0.04E-2
22.8
> 0.017e4 * (4 - 2)
340
> blah
'Error. Unexpected token: b'
> 18 + blah
'Error. Invalid expression'
> 5
5
> 5 + 
'Error. Invalid expression'
> 5 + (
'Error. Invalid expression'
> 5 + (6
'Error. Invalid expression'
> 5 + (6 *
'Error. Invalid expression'
> 5 + (6 * 5
'Error. Invalid expression'
> 5 + (6 * 5)
35
```