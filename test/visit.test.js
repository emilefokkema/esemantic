import {visit} from '../src/visit';
import visitorCases from './visitor-cases';

function createVisitorMethod(){
	var actualNodeTypes = [];
	return {
		actualNodeTypes: actualNodeTypes,
		callWithNode: function(n){
			actualNodeTypes.push(n.type);
		}
	};
}

function addMethodToVisitor(visitor, method){
	var visitorMethod = createVisitorMethod();
	visitor[method.methodName] = function(node){
		visitorMethod.callWithNode(node);
		return visitor;
	};
	return visitorMethod;
}

function createVisitorThatHasMethods(methods){
	var visitor = {};
	var methodsToVerify = {};
	for(let method of methods){
		methodsToVerify[method.methodName] = addMethodToVisitor(visitor, method);
	}
	return {
		visitor: visitor,
		methodsToVerify: methodsToVerify
	};
}

describe.each(visitorCases.map(c => [c.script, c.tree, c.visitorCases]))('when visiting', (script, tree, cases) => {
	
	describe(`the tree for script '${script}'`, () => {

		describe.each(cases.map(c => [c.methods, c.expectException]))('with a visitor', (methods, expectException) => {

			describe(`that has methods ${methods.map(m => `'${m.methodName}'`).join(', ')}`, () => {
				var visitor;
				var caughtException;

				beforeAll(() => {
					visitor = createVisitorThatHasMethods(methods);
					try{
						visit(tree, visitor.visitor);
					}catch(e){
						caughtException = e;
					}
				});

				it(`an exception should ${expectException ? '':'not'} have been thrown`, () => {
					if(expectException && !caughtException){
						fail('expected an exception to have been thrown')
					}
					if(!expectException && caughtException){
						throw caughtException;
					}
				});

				describe.each(methods.map(m => [m.methodName, m.expectedNodeTypes]))('the method', (methodName, expectedNodeTypes) => {

					it(`'${methodName}' should have been called with ${expectedNodeTypes.map(t => `'${t}'`).join(', ')}`, () => {
						expect(visitor.methodsToVerify[methodName].actualNodeTypes).toEqual(expectedNodeTypes);
					});
				});
			});
		});
	});
});

describe('when visiting a tree for a program containing two declarations', () => {
	let tree, visitor, declarationsVisited, firstDeclaration, secondDeclaration;

	beforeEach(() => {
		//tree for `var a = 1;function b(){}`
		tree = {
		  "type": "Program",
		  "start": 0,
		  "end": 25,
		  "body": [
		    {
		      "type": "VariableDeclaration",
		      "start": 0,
		      "end": 10,
		      "declarations": [
		        {
		          "type": "VariableDeclarator",
		          "start": 4,
		          "end": 9,
		          "id": {
		            "type": "Identifier",
		            "start": 4,
		            "end": 5,
		            "name": "a"
		          },
		          "init": {
		            "type": "Literal",
		            "start": 8,
		            "end": 9,
		            "value": 1,
		            "raw": "1"
		          }
		        }
		      ],
		      "kind": "var"
		    },
		    {
		      "type": "FunctionDeclaration",
		      "start": 10,
		      "end": 24,
		      "id": {
		        "type": "Identifier",
		        "start": 19,
		        "end": 20,
		        "name": "b"
		      },
		      "expression": false,
		      "generator": false,
		      "async": false,
		      "params": [],
		      "body": {
		        "type": "BlockStatement",
		        "start": 22,
		        "end": 24,
		        "body": []
		      }
		    }
		  ],
		  "sourceType": "module"
		};
		firstDeclaration = tree.body[0];
		secondDeclaration = tree.body[1];
		declarationsVisited = [];
		visitor = {
			Declaration(node){
				declarationsVisited.push(node);
			}
		};
		visit(tree, visitor);
	});

	it('both delarations should have been visited', () => {
		expect(declarationsVisited.length).toBe(2);
		expect(declarationsVisited[0]).toBe(firstDeclaration);
		expect(declarationsVisited[1]).toBe(secondDeclaration);
	});

});

describe('when replacing one visitor with another during a visit', () => {
	let tree, variableDeclaration, visitedVariableDeclaration;

	beforeEach(() => {
		// for script `var a;`
		tree = {
		  "type": "Program",
		  "start": 0,
		  "end": 7,
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
		    }
		  ],
		  "sourceType": "script"
		};
		variableDeclaration = tree.body[0];
		visit(tree, {
			Declaration(node1, useVisitor){
				return useVisitor({
					VariableDeclaration(node2){
						visitedVariableDeclaration = node2;
					}
				})
			}
		});
	});

	it('the other visitor should have been used for the same node', () => {
		expect(visitedVariableDeclaration).toBe(variableDeclaration);
	});
});

describe('when a visit of a node is at an end', () => {
	let tree, visitedChildrenOfFirstDeclarator, visitedChildrenOfSecondDeclarator;

	beforeEach(() => {
		// for script `var a = b + c;var d = e;`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 26,
			"body": [
			  {
				"type": "VariableDeclaration",
				"start": 0,
				"end": 14,
				"declarations": [
				  {
					"type": "VariableDeclarator",
					"start": 4,
					"end": 13,
					"id": {
					  "type": "Identifier",
					  "start": 4,
					  "end": 5,
					  "name": "a"
					},
					"init": {
					  "type": "BinaryExpression",
					  "start": 8,
					  "end": 13,
					  "left": {
						"type": "Identifier",
						"start": 8,
						"end": 9,
						"name": "b"
					  },
					  "operator": "+",
					  "right": {
						"type": "Identifier",
						"start": 12,
						"end": 13,
						"name": "c"
					  }
					}
				  }
				],
				"kind": "var"
			  },
			  {
				"type": "VariableDeclaration",
				"start": 15,
				"end": 25,
				"declarations": [
				  {
					"type": "VariableDeclarator",
					"start": 19,
					"end": 24,
					"id": {
					  "type": "Identifier",
					  "start": 19,
					  "end": 20,
					  "name": "d"
					},
					"init": {
					  "type": "Identifier",
					  "start": 23,
					  "end": 24,
					  "name": "e"
					}
				  }
				],
				"kind": "var"
			  }
			],
			"sourceType": "script"
		  };
		var visitedFirstDeclarator = false;
		visit(tree, {
			VariableDeclarator(node, useVisitor, onDone){
				var childrenVisited = [];
				onDone(() => {
					if(!visitedFirstDeclarator){
						visitedFirstDeclarator = true;
						visitedChildrenOfFirstDeclarator = childrenVisited.slice();
					}else{
						visitedChildrenOfSecondDeclarator = childrenVisited.slice();
					}
				});
				return {
					Node(child){
						childrenVisited.push(child);
					}
				};
			}
		});

	});

	it('the visit method should have been notified of that', () => {
		expect(visitedChildrenOfFirstDeclarator).toEqual([
			tree.body[0].declarations[0].id,
			tree.body[0].declarations[0].init
		]);
		expect(visitedChildrenOfSecondDeclarator).toEqual([
			tree.body[1].declarations[0].id,
			tree.body[1].declarations[0].init
		]);
	});
});

describe('when registering a done handler in both the visitor method and the replacing visitor method', () => {
	let tree, doneIndicators;

	beforeEach(() => {
		// for script `var a = b;`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 11,
			"body": [
			  {
				"type": "VariableDeclaration",
				"start": 0,
				"end": 10,
				"declarations": [
				  {
					"type": "VariableDeclarator",
					"start": 4,
					"end": 9,
					"id": {
					  "type": "Identifier",
					  "start": 4,
					  "end": 5,
					  "name": "a"
					},
					"init": {
					  "type": "Identifier",
					  "start": 8,
					  "end": 9,
					  "name": "b"
					}
				  }
				],
				"kind": "var"
			  }
			],
			"sourceType": "script"
		  };
		doneIndicators = [];
		visit(tree, {
			Declaration(node1, useVisitor, onDone){
				onDone(() => {
					doneIndicators.push(1);
				});
				return useVisitor({
					VariableDeclaration(node2, useVisitor, onDone){
						onDone(() => {
							doneIndicators.push(2);
						});
						return {
							Node(){return this;}
						};
					}
				});
			}
		});
	});

	it('they should have been called in the right order', () => {
		expect(doneIndicators).toEqual([2, 1]);
	});
});