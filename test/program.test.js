import { createProgram } from '../src/create-program';

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
		program = createProgram(tree);
	});

	it('should result in this tree', () => {
		expect(program).toEqual({
			kind: "Program",
			tree: tree,
			operations: [
				{
					kind: "VariableDeclaration",
					tree: tree.body[0],
					declarators: [
						{
							kind: "VariableDeclarator",
							tree: tree.body[0].declarations[0],
							assignment: {
								kind: "SymbolAssignment",
								tree: tree.body[0].declarations[0].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[0].id,
									symbol: {
										name: "a",
										declaration: tree.body[0].declarations[0].id,
										kind: "var"
									}
								}
							}
						}
					]
				},
				{
					kind: "FunctionDeclaration",
					tree: tree.body[2],
					assignment: {
						kind: "SymbolAssignment",
						tree: tree.body[2].id,
						reference: {
							kind: "SymbolReference",
							tree: tree.body[2].id,
							symbol: {
								name: "c",
								declaration: tree.body[2].id,
								kind: "var"
							}
						}
					},
					params: [
						{
							kind: "ParameterAssignment",
							tree: tree.body[2].params[0],
							assignment: {
								kind: "SymbolAssignment",
								tree: tree.body[2].params[0],
								reference: {
									kind: "SymbolReference",
									tree:  tree.body[2].params[0],
									symbol: {
										declaration: tree.body[2].params[0],
										name: "d",
										kind: "var"
									}
								}
							}
						}
					],
					body: {
						kind: "Block",
						tree: tree.body[2].body,
						operations: []
					}
				}
			]
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
		program = createProgram(tree);
	});

	it('should result in this tree', () => {
		expect(program).toEqual({
			kind: "Program",
			tree: tree,
			operations: [
				{
					kind: "FunctionDeclaration",
					tree: tree.body[0],
					assignment: {
						kind: "SymbolAssignment",
						tree: tree.body[0].id,
						reference: {
							kind: "SymbolReference",
							tree: tree.body[0].id,
							symbol: {
								name: "a",
								declaration: tree.body[0].id,
								kind: "var"
							}
						}
					},
					params: [
						{
							kind: "ParameterAssignment",
							tree: tree.body[0].params[0],
							assignment: {
								kind: "RestElementAssignment",
								tree: tree.body[0].params[0],
								assignment: {
									tree: tree.body[0].params[0].argument,
									kind: "SymbolAssignment",
									reference: {
										kind: "SymbolReference",
										tree: tree.body[0].params[0].argument,
										symbol: {
											name: "b",
											kind: "var",
											declaration: tree.body[0].params[0].argument
										}
									}
								}
							}
						}
					],
					body: {
						kind: "Block",
						tree: tree.body[0].body,
						operations: []
					}
				}
			]
		});
	});
});

describe('a program with a function with an object pattern as parameter', () => {
	let program, tree;

	beforeEach(() => {
		// for script `function a({b:c, d}){b;c;d;}`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 29,
			"body": [
			  {
				"type": "FunctionDeclaration",
				"start": 0,
				"end": 28,
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
					"type": "ObjectPattern",
					"start": 11,
					"end": 19,
					"properties": [
					  {
						"type": "Property",
						"start": 12,
						"end": 15,
						"method": false,
						"shorthand": false,
						"computed": false,
						"key": {
						  "type": "Identifier",
						  "start": 12,
						  "end": 13,
						  "name": "b"
						},
						"value": {
						  "type": "Identifier",
						  "start": 14,
						  "end": 15,
						  "name": "c"
						},
						"kind": "init"
					  },
					  {
						"type": "Property",
						"start": 17,
						"end": 18,
						"method": false,
						"shorthand": true,
						"computed": false,
						"key": {
						  "type": "Identifier",
						  "start": 17,
						  "end": 18,
						  "name": "d"
						},
						"kind": "init",
						"value": {
						  "type": "Identifier",
						  "start": 17,
						  "end": 18,
						  "name": "d"
						}
					  }
					]
				  }
				],
				"body": {
				  "type": "BlockStatement",
				  "start": 20,
				  "end": 28,
				  "body": [
					{
					  "type": "ExpressionStatement",
					  "start": 21,
					  "end": 23,
					  "expression": {
						"type": "Identifier",
						"start": 21,
						"end": 22,
						"name": "b"
					  }
					},
					{
					  "type": "ExpressionStatement",
					  "start": 23,
					  "end": 25,
					  "expression": {
						"type": "Identifier",
						"start": 23,
						"end": 24,
						"name": "c"
					  }
					},
					{
					  "type": "ExpressionStatement",
					  "start": 25,
					  "end": 27,
					  "expression": {
						"type": "Identifier",
						"start": 25,
						"end": 26,
						"name": "d"
					  }
					}
				  ]
				}
			  }
			],
			"sourceType": "script"
		  }
		program = createProgram(tree);
	});

	it('should result in this tree', () => {
		expect(program).toEqual({
			kind: "Program",
			tree: tree,
			operations: [
				{
					kind: "FunctionDeclaration",
					tree: tree.body[0],
					assignment: {
						kind: "SymbolAssignment",
						tree: tree.body[0].id,
						reference: {
							kind: "SymbolReference",
							tree: tree.body[0].id,
							symbol: {
								name: "a",
								declaration: tree.body[0].id,
								kind: "var"
							}
						}
					},
					params: [
						{
							kind: "ParameterAssignment",
							tree: tree.body[0].params[0],
							assignment: {
								kind: "ObjectDestructuringAssignment",
								tree: tree.body[0].params[0],
								properties: [
									{
										kind: "PropertyDestructuringAssignment",
										tree: tree.body[0].params[0].properties[0],
										valueAssignment: {
											kind: "SymbolAssignment",
											tree: tree.body[0].params[0].properties[0].value,
											reference: {
												kind: "SymbolReference",
												tree: tree.body[0].params[0].properties[0].value,
												symbol: {
													name: "c",
													kind: "var",
													declaration: tree.body[0].params[0].properties[0].value
												}
											}
										}
									},
									{
										kind: "PropertyDestructuringAssignment",
										tree: tree.body[0].params[0].properties[1],
										valueAssignment: {
											kind: "SymbolAssignment",
											tree: tree.body[0].params[0].properties[1].value,
											reference: {
												kind: "SymbolReference",
												tree: tree.body[0].params[0].properties[1].value,
												symbol: {
													name: "d",
													declaration: tree.body[0].params[0].properties[1].value,
													kind: "var"
												}
											}
										}
									}
								]
							}
						}
					],
					body: {
						kind: "Block",
						tree: tree.body[0].body,
						operations: []
					}
				}
			]
		});
	});
});

describe('a program with a function with an array pattern as a parameter', () => {
	let program, tree;

	beforeEach(() => {
		// for script `function a([b, c]){}`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 21,
			"body": [
			  {
				"type": "FunctionDeclaration",
				"start": 0,
				"end": 20,
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
					"type": "ArrayPattern",
					"start": 11,
					"end": 17,
					"elements": [
					  {
						"type": "Identifier",
						"start": 12,
						"end": 13,
						"name": "b"
					  },
					  {
						"type": "Identifier",
						"start": 15,
						"end": 16,
						"name": "c"
					  }
					]
				  }
				],
				"body": {
				  "type": "BlockStatement",
				  "start": 18,
				  "end": 20,
				  "body": []
				}
			  }
			],
			"sourceType": "script"
		  };
		program = createProgram(tree);
	});
	
	it('should result in this tree', () => {
		expect(program).toEqual({
			kind: "Program",
			tree: tree,
			operations: [
				{
					kind: "FunctionDeclaration",
					tree: tree.body[0],
					assignment: {
						kind: "SymbolAssignment",
						tree: tree.body[0].id,
						reference: {
							kind: "SymbolReference",
							tree: tree.body[0].id,
							symbol:{
								name: "a",
								declaration: tree.body[0].id,
								kind: "var"
							}
						}
					},
					params: [
						{
							kind: "ParameterAssignment",
							tree: tree.body[0].params[0],
							assignment: {
								kind: "ArrayDestructuringAssignment",
								tree: tree.body[0].params[0],
								elements: [
									{
										kind: "SymbolAssignment",
										tree: tree.body[0].params[0].elements[0],
										reference: {
											kind: "SymbolReference",
											tree: tree.body[0].params[0].elements[0],
											symbol: {
												name: "b",
												declaration: tree.body[0].params[0].elements[0],
												kind: "var"
											}
										}
									},
									{
										kind: "SymbolAssignment",
										tree: tree.body[0].params[0].elements[1],
										reference: {
											kind: "SymbolReference",
											tree: tree.body[0].params[0].elements[1],
											symbol: {
												name: "c",
												declaration: tree.body[0].params[0].elements[1],
												kind: "var"
											}
										}
									}
								]
							}
						}
					],
					body: {
						kind: "Block",
						tree: tree.body[0].body,
						operations: []
					}
				}
			]
		})
	});
});

describe('a program with a functin with an assignment pattern as a parameter', () => {
	let program, tree;

	beforeEach(() => {
		// for script `function a(b = 5){}`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 20,
			"body": [
			  {
				"type": "FunctionDeclaration",
				"start": 0,
				"end": 19,
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
					"type": "AssignmentPattern",
					"start": 11,
					"end": 16,
					"left": {
					  "type": "Identifier",
					  "start": 11,
					  "end": 12,
					  "name": "b"
					},
					"right": {
					  "type": "Literal",
					  "start": 15,
					  "end": 16,
					  "value": 5,
					  "raw": "5"
					}
				  }
				],
				"body": {
				  "type": "BlockStatement",
				  "start": 17,
				  "end": 19,
				  "body": []
				}
			  }
			],
			"sourceType": "script"
		  };
		program = createProgram(tree);
	});

	it('should result in this tree', () => {
		expect(program).toEqual({
			kind: "Program",
			tree: tree,
			operations: [
				{
					kind: "FunctionDeclaration",
					tree: tree.body[0],
					assignment: {
						kind: "SymbolAssignment",
						tree: tree.body[0].id,
						reference: {
							kind: "SymbolReference",
							tree: tree.body[0].id,
							symbol: {
								name: "a",
								declaration: tree.body[0].id,
								kind: "var"
							}
						}
					},
					params: [
						{
							kind: "ParameterAssignment",
							tree: tree.body[0].params[0],
							assignment: {
								kind: "DefaultAssignment",
								tree: tree.body[0].params[0],
								assignment: {
									kind: "SymbolAssignment",
									tree: tree.body[0].params[0].left,
									reference: {
										kind: "SymbolReference",
										tree: tree.body[0].params[0].left,
										symbol: {
											name: "b",
											declaration: tree.body[0].params[0].left,
											kind: "var"
										}
									}
								}
							}
						}
					],
					body: {
						kind: "Block",
						tree: tree.body[0].body,
						operations: []
					}
				}
			]
		});
	});
});

describe('a program containing a variable declarator with an object pattern', () => {
	let program, tree;

	beforeEach(() => {
		// for script `var {a:b, c} = {};`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 19,
			"body": [
			  {
				"type": "VariableDeclaration",
				"start": 0,
				"end": 18,
				"declarations": [
				  {
					"type": "VariableDeclarator",
					"start": 4,
					"end": 17,
					"id": {
					  "type": "ObjectPattern",
					  "start": 4,
					  "end": 12,
					  "properties": [
						{
						  "type": "Property",
						  "start": 5,
						  "end": 8,
						  "method": false,
						  "shorthand": false,
						  "computed": false,
						  "key": {
							"type": "Identifier",
							"start": 5,
							"end": 6,
							"name": "a"
						  },
						  "value": {
							"type": "Identifier",
							"start": 7,
							"end": 8,
							"name": "b"
						  },
						  "kind": "init"
						},
						{
						  "type": "Property",
						  "start": 10,
						  "end": 11,
						  "method": false,
						  "shorthand": true,
						  "computed": false,
						  "key": {
							"type": "Identifier",
							"start": 10,
							"end": 11,
							"name": "c"
						  },
						  "kind": "init",
						  "value": {
							"type": "Identifier",
							"start": 10,
							"end": 11,
							"name": "c"
						  }
						}
					  ]
					},
					"init": {
					  "type": "ObjectExpression",
					  "start": 15,
					  "end": 17,
					  "properties": []
					}
				  }
				],
				"kind": "var"
			  }
			],
			"sourceType": "script"
		  };
		program = createProgram(tree);
	});

	it('should result in this tree', () => {
		expect(program).toEqual({
			kind: "Program",
			tree: tree,
			operations: [
				{
					kind: "VariableDeclaration",
					tree: tree.body[0],
					declarators: [
						{
							kind: "VariableDeclarator",
							tree: tree.body[0].declarations[0],
							assignment: {
								kind: "ObjectDestructuringAssignment",
								tree: tree.body[0].declarations[0].id,
								properties: [
									{
										kind: "PropertyDestructuringAssignment",
										tree: tree.body[0].declarations[0].id.properties[0],
										valueAssignment: {
											kind: "SymbolAssignment",
											tree: tree.body[0].declarations[0].id.properties[0].value,
											reference: {
												kind: "SymbolReference",
												tree: tree.body[0].declarations[0].id.properties[0].value,
												symbol: {
													name: "b",
													declaration: tree.body[0].declarations[0].id.properties[0].value,
													kind: "var"
												}
											}
										}
									},
									{
										kind: "PropertyDestructuringAssignment",
										tree: tree.body[0].declarations[0].id.properties[1],
										valueAssignment: {
											kind: "SymbolAssignment",
											tree: tree.body[0].declarations[0].id.properties[1].value,
											reference: {
												kind: "SymbolReference",
												tree: tree.body[0].declarations[0].id.properties[1].value,
												symbol: {
													name: "c",
													declaration: tree.body[0].declarations[0].id.properties[1].value,
													kind: "var"
												}
											}
										}
									}
								]
							}
						}
					]
				}
			]
		});
	});
});
