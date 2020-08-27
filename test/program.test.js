import { Program } from '../src/program';

describe('a program', () => {
	let program, tree;

	beforeEach(() => {
		//from script `var a;b;function c(d){a;d;c;}`
		tree = {
		  "type": "Program",
		  "start": 0,
		  "end": 29,
		  "body": [
		    {
		      "type": "VariableDeclaration",
		      "start": 0,
		      "end": 6,
		      "declarations": [
		        {
		          "type": "VariableDeclarator",
		          "start": 4,
		          "end": 5,
		          "id": {
		            "type": "Identifier",
		            "start": 4,
		            "end": 5,
		            "name": "a"
		          },
		          "init": null
		        }
		      ],
		      "kind": "var"
		    },
		    {
		      "type": "ExpressionStatement",
		      "start": 6,
		      "end": 8,
		      "expression": {
		        "type": "Identifier",
		        "start": 6,
		        "end": 7,
		        "name": "b"
		      }
		    },
		    {
		      "type": "FunctionDeclaration",
		      "start": 8,
		      "end": 29,
		      "id": {
		        "type": "Identifier",
		        "start": 17,
		        "end": 18,
		        "name": "c"
		      },
		      "expression": false,
		      "generator": false,
		      "async": false,
		      "params": [
		        {
		          "type": "Identifier",
		          "start": 19,
		          "end": 20,
		          "name": "d"
		        }
		      ],
		      "body": {
		        "type": "BlockStatement",
		        "start": 21,
		        "end": 29,
		        "body": [
		          {
		            "type": "ExpressionStatement",
		            "start": 22,
		            "end": 24,
		            "expression": {
		              "type": "Identifier",
		              "start": 22,
		              "end": 23,
		              "name": "a"
		            }
		          },
		          {
		            "type": "ExpressionStatement",
		            "start": 24,
		            "end": 26,
		            "expression": {
		              "type": "Identifier",
		              "start": 24,
		              "end": 25,
		              "name": "d"
		            }
		          },
		          {
		            "type": "ExpressionStatement",
		            "start": 26,
		            "end": 28,
		            "expression": {
		              "type": "Identifier",
		              "start": 26,
		              "end": 27,
		              "name": "c"
		            }
		          }
		        ]
		      }
		    }
		  ],
		  "sourceType": "script"
		};
		program = Program.create(tree);
	});

	describe('that is asked for operations', () => {
		let variableDeclarationNode, variableDeclaratorNode, functionDeclarationNode, functionBodyNode, parameterNode;
		let variableDeclarationOperation, variableDeclaratorOperation, functionDeclarationOperation, functionBodyOperation, parameterDeclarationOperation;

		beforeEach(() => {
			variableDeclarationNode = tree.body[0];
			variableDeclaratorNode = variableDeclarationNode.declarations[0];
			functionDeclarationNode = tree.body[2];
			functionBodyNode = functionDeclarationNode.body;
			parameterNode = functionDeclarationNode.params[0];
			variableDeclarationOperation = program.getOperation(variableDeclarationNode);
			variableDeclaratorOperation = program.getOperation(variableDeclaratorNode);
			functionDeclarationOperation = program.getOperation(functionDeclarationNode);
			functionBodyOperation = program.getOperation(functionBodyNode);
			parameterDeclarationOperation = program.getOperation(parameterNode);
		});

		it('should return something', () => {
			expect(variableDeclarationOperation).toBeTruthy();
			expect(variableDeclaratorOperation).toBeTruthy();
			expect(functionDeclarationOperation).toBeTruthy();
			expect(functionBodyOperation).toBeTruthy();
			expect(parameterDeclarationOperation).toBeTruthy();
		});
	});
});

describe('a program with a function with a rest element as parameter', () => {
	let program, tree;

	beforeEach(() => {
		//from script `function a(...b){}`
		tree = {
		  "type": "Program",
		  "start": 0,
		  "end": 18,
		  "body": [
		    {
		      "type": "FunctionDeclaration",
		      "start": 0,
		      "end": 18,
		      "id": {
		        "type": "Identifier",
		        "start": 9,
		        "end": 10,
		        "name": "a"
		      },
		      "expression": false,
		      "generator": false,
		      "async": false,
		      "params": [
		        {
		          "type": "RestElement",
		          "start": 11,
		          "end": 15,
		          "argument": {
		            "type": "Identifier",
		            "start": 14,
		            "end": 15,
		            "name": "b"
		          }
		        }
		      ],
		      "body": {
		        "type": "BlockStatement",
		        "start": 16,
		        "end": 18,
		        "body": []
		      }
		    }
		  ],
		  "sourceType": "script"
		};
		program = Program.create(tree);
	});

	it('should have an operation for the spread element', () => {
		expect(program.getOperation(tree.body[0].params[0])).toBeTruthy();
	});
});