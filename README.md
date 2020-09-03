## Esemantic

Esemantic takes as input an Abstract Syntax Tree ([AST](https://github.com/estree/estree)) describing an EcmaScript program, and produces as output a tree that describes the operations that the program beforms, such as declaring a function or referring to a variable.

For example, if we use [Acorn](https://github.com/acornjs/acorn) to give us an AST, we can do:
```js
import { parse } from 'acorn';
import { createProgram } from 'esemantic';

var script = `var a;function b(c){c;}`;
var ast = parse(script);
var program = createProgram(ast);
```

## Operations

Each of the nodes making up the tree created by Esemantic represents an operation. Below is the definition for each of the different types of operation. (The syntax for the definitions is inspired by [Estree](https://github.com/estree/estree)'s definitions for the AST node types.)

### Operation

```js
interface Operation{
    kind: string;
    tree: estree.Node;
}
```
The type referred to as `estree.Node` is the type of node that makes up the AST that was given as input to `createProgram`.
