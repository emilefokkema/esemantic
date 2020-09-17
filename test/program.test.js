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
								kind: "ReferenceAssignment",
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
							},
							init: null
						}
					]
				},
				{
					kind: "Expression",
					tree: tree.body[1],
					operation: {
						kind: "SymbolReference",
						tree: tree.body[1].expression,
						symbol: undefined
					}
				},
				{
					kind: "FunctionDeclaration",
					tree: tree.body[2],
					assignment: {
						kind: "ReferenceAssignment",
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
								kind: "ReferenceAssignment",
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
						operations: [
							{
								kind: "Expression",
								tree: tree.body[2].body.body[0],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[2].body.body[0].expression,
									symbol: {
										name: "a",
										declaration: tree.body[0].declarations[0].id,
										kind: "var"
									}
								}
							},
							{
								kind: "Expression",
								tree: tree.body[2].body.body[1],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[2].body.body[1].expression,
									symbol: {
										declaration: tree.body[2].params[0],
										name: "d",
										kind: "var"
									}
								}
							},
							{
								kind: "Expression",
								tree: tree.body[2].body.body[2],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[2].body.body[2].expression,
									symbol: {
										name: "c",
										declaration: tree.body[2].id,
										kind: "var"
									}
								}
							}
						]
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
						kind: "ReferenceAssignment",
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
									kind: "ReferenceAssignment",
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
						kind: "ReferenceAssignment",
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
											kind: "ReferenceAssignment",
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
											kind: "ReferenceAssignment",
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
						operations: [
							{
								kind: "Expression",
								tree: tree.body[0].body.body[0],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[0].body.body[0].expression,
									symbol: undefined
								}
							},
							{
								kind: "Expression",
								tree: tree.body[0].body.body[1],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[0].body.body[1].expression,
									symbol: {
										name: "c",
										kind: "var",
										declaration: tree.body[0].params[0].properties[0].value
									}
								}
							},
							{
								kind: "Expression",
								tree: tree.body[0].body.body[2],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[0].body.body[2].expression,
									symbol: {
										name: "d",
										declaration: tree.body[0].params[0].properties[1].value,
										kind: "var"
									}
								}
							}
						]
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
						kind: "ReferenceAssignment",
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
										kind: "ReferenceAssignment",
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
										kind: "ReferenceAssignment",
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
						kind: "ReferenceAssignment",
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
									kind: "ReferenceAssignment",
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
								},
								defaultValue: {
									kind: "Literal",
									tree: tree.body[0].params[0].right,
									constantValue: 5
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

describe('a program with a function with as assignment pattern with an object pattern as left as parameter', () => {
	let program, tree;

	beforeEach(() => {
		//for script `function a({b:c} = d){}`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 24,
			"body": [
			  {
				"type": "FunctionDeclaration",
				"start": 0,
				"end": 23,
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
					"end": 20,
					"left": {
					  "type": "ObjectPattern",
					  "start": 11,
					  "end": 16,
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
						}
					  ]
					},
					"right": {
					  "type": "Identifier",
					  "start": 19,
					  "end": 20,
					  "name": "d"
					}
				  }
				],
				"body": {
				  "type": "BlockStatement",
				  "start": 21,
				  "end": 23,
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
						kind: "ReferenceAssignment",
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
									kind: "ObjectDestructuringAssignment",
									tree: tree.body[0].params[0].left,
									properties: [
										{
											kind: "PropertyDestructuringAssignment",
											tree: tree.body[0].params[0].left.properties[0],
											valueAssignment: {
												kind: "ReferenceAssignment",
												tree: tree.body[0].params[0].left.properties[0].value,
												reference: {
													kind: "SymbolReference",
													tree: tree.body[0].params[0].left.properties[0].value,
													symbol: {
														name: "c",
														kind: "var",
														declaration: tree.body[0].params[0].left.properties[0].value
													}
												}
											}
										}
									]
								},
								defaultValue: {
									kind: "SymbolReference",
									tree: tree.body[0].params[0].right,
									symbol: undefined
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
		})
	});
});

describe('a program containing a variable declarator with an object pattern', () => {
	let program, tree;

	beforeEach(() => {
		// for script `var {a:b, c} = {a: 1, c: d};`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 28,
			"body": [
				{
					"type": "VariableDeclaration",
					"start": 0,
					"end": 28,
					"declarations": [
						{
							"type": "VariableDeclarator",
							"start": 4,
							"end": 27,
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
								"end": 27,
								"properties": [
									{
										"type": "Property",
										"start": 16,
										"end": 20,
										"method": false,
										"shorthand": false,
										"computed": false,
										"key": {
											"type": "Identifier",
											"start": 16,
											"end": 17,
											"name": "a"
										},
										"value": {
											"type": "Literal",
											"start": 19,
											"end": 20,
											"value": 1,
											"raw": "1"
										},
										"kind": "init"
									},
									{
										"type": "Property",
										"start": 22,
										"end": 26,
										"method": false,
										"shorthand": false,
										"computed": false,
										"key": {
											"type": "Identifier",
											"start": 22,
											"end": 23,
											"name": "c"
										},
										"value": {
											"type": "Identifier",
											"start": 25,
											"end": 26,
											"name": "d"
										},
										"kind": "init"
									}
								]
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
											kind: "ReferenceAssignment",
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
											kind: "ReferenceAssignment",
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
							},
							init: {
								kind: "Object",
								tree: tree.body[0].declarations[0].init,
								properties: [
									{
										kind: "ObjectProperty",
										tree: tree.body[0].declarations[0].init.properties[0],
										value: {
											kind: "Literal",
											tree: tree.body[0].declarations[0].init.properties[0].value,
											constantValue: 1
										}
									},
									{
										kind: "ObjectProperty",
										tree: tree.body[0].declarations[0].init.properties[1],
										value: {
											kind: "SymbolReference",
											tree: tree.body[0].declarations[0].init.properties[1].value,
											symbol: undefined
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

describe('a program containing a variable declaration and an assignment', () => {
	let tree, program;

	beforeEach(() => {
		//for script `var a;a = 1;`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 13,
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
				"end": 12,
				"expression": {
				  "type": "AssignmentExpression",
				  "start": 6,
				  "end": 11,
				  "operator": "=",
				  "left": {
					"type": "Identifier",
					"start": 6,
					"end": 7,
					"name": "a"
				  },
				  "right": {
					"type": "Literal",
					"start": 10,
					"end": 11,
					"value": 1,
					"raw": "1"
				  }
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
								kind: "ReferenceAssignment",
								tree: tree.body[0].declarations[0].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[0].id,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[0].declarations[0].id
									}
								}
							},
							init: null
						}
					]
				},
				{
					kind: "Expression",
					tree: tree.body[1],
					operation: {
						kind: "ValueAssignment",
						tree: tree.body[1].expression,
						value: {
							kind: "Literal",
							tree: tree.body[1].expression.right,
							constantValue:1
						},
						assignment: {
							kind: "ReferenceAssignment",
							tree: tree.body[1].expression.left,
							reference: {
								kind: "SymbolReference",
								tree: tree.body[1].expression.left,
								symbol: {
									name: "a",
									kind: "var",
									declaration: tree.body[0].declarations[0].id
								}
							}
						}
					}
				}
			]
		})
	});
});

describe('a program containing a variable declaration and a destructuring assignment', () => {
	let tree, program;

	beforeEach(() => {
		//for script `var a, b;({a, b} = c)`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 22,
			"body": [
			  {
				"type": "VariableDeclaration",
				"start": 0,
				"end": 9,
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
				  },
				  {
					"type": "VariableDeclarator",
					"start": 7,
					"end": 8,
					"id": {
					  "type": "Identifier",
					  "start": 7,
					  "end": 8,
					  "name": "b"
					},
					"init": null
				  }
				],
				"kind": "var"
			  },
			  {
				"type": "ExpressionStatement",
				"start": 9,
				"end": 21,
				"expression": {
				  "type": "AssignmentExpression",
				  "start": 10,
				  "end": 20,
				  "operator": "=",
				  "left": {
					"type": "ObjectPattern",
					"start": 10,
					"end": 16,
					"properties": [
					  {
						"type": "Property",
						"start": 11,
						"end": 12,
						"method": false,
						"shorthand": true,
						"computed": false,
						"key": {
						  "type": "Identifier",
						  "start": 11,
						  "end": 12,
						  "name": "a"
						},
						"kind": "init",
						"value": {
						  "type": "Identifier",
						  "start": 11,
						  "end": 12,
						  "name": "a"
						}
					  },
					  {
						"type": "Property",
						"start": 14,
						"end": 15,
						"method": false,
						"shorthand": true,
						"computed": false,
						"key": {
						  "type": "Identifier",
						  "start": 14,
						  "end": 15,
						  "name": "b"
						},
						"kind": "init",
						"value": {
						  "type": "Identifier",
						  "start": 14,
						  "end": 15,
						  "name": "b"
						}
					  }
					]
				  },
				  "right": {
					"type": "Identifier",
					"start": 19,
					"end": 20,
					"name": "c"
				  }
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
					kind: "VariableDeclaration",
					tree: tree.body[0],
					declarators: [
						{
							kind: "VariableDeclarator",
							tree: tree.body[0].declarations[0],
							assignment: {
								kind: "ReferenceAssignment",
								tree: tree.body[0].declarations[0].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[0].id,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[0].declarations[0].id
									}
								}
							},
							init: null
						},
						{
							kind: "VariableDeclarator",
							tree: tree.body[0].declarations[1],
							assignment: {
								kind: "ReferenceAssignment",
								tree: tree.body[0].declarations[1].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[1].id,
									symbol: {
										name: "b",
										kind: "var",
										declaration: tree.body[0].declarations[1].id
									}
								}
							},
							init: null
						}
					]
				},
				{
					kind: "Expression",
					tree: tree.body[1],
					operation: {
						kind: "ValueAssignment",
						tree: tree.body[1].expression,
						assignment: {
							kind: "ObjectDestructuringAssignment",
							tree: tree.body[1].expression.left,
							properties: [
								{
									kind: "PropertyDestructuringAssignment",
									tree: tree.body[1].expression.left.properties[0],
									valueAssignment: {
										kind: "ReferenceAssignment",
										tree: tree.body[1].expression.left.properties[0].value,
										reference: {
											kind: "SymbolReference",
											tree: tree.body[1].expression.left.properties[0].value,
											symbol: {
												name: "a",
												kind: "var",
												declaration: tree.body[0].declarations[0].id
											}
										}
									}
								},
								{
									kind: "PropertyDestructuringAssignment",
									tree: tree.body[1].expression.left.properties[1],
									valueAssignment: {
										kind: "ReferenceAssignment",
										tree: tree.body[1].expression.left.properties[1].value,
										reference: {
											kind: "SymbolReference",
											tree: tree.body[1].expression.left.properties[1].value,
											symbol: {
												name: "b",
												kind: "var",
												declaration: tree.body[0].declarations[1].id
											}
										}
									}
								}
							]
						},
						value: {
							kind: "SymbolReference",
							tree: tree.body[1].expression.right,
							symbol: undefined
						}
					}
				}
			]
		})
	});
});

describe('a program containing a function with default parameters', () => {
	let tree, program;

	beforeEach(() => {
		// for script `var a;function b(c = a, d = c){var a;a;d;c;}`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 44,
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
					"type": "FunctionDeclaration",
					"start": 6,
					"end": 44,
					"id": {
						"type": "Identifier",
						"start": 15,
						"end": 16,
						"name": "b"
					},
					"expression": false,
					"generator": false,
					"async": false,
					"params": [
						{
							"type": "AssignmentPattern",
							"start": 17,
							"end": 22,
							"left": {
								"type": "Identifier",
								"start": 17,
								"end": 18,
								"name": "c"
							},
							"right": {
								"type": "Identifier",
								"start": 21,
								"end": 22,
								"name": "a"
							}
						},
						{
							"type": "AssignmentPattern",
							"start": 24,
							"end": 29,
							"left": {
								"type": "Identifier",
								"start": 24,
								"end": 25,
								"name": "d"
							},
							"right": {
								"type": "Identifier",
								"start": 28,
								"end": 29,
								"name": "c"
							}
						}
					],
					"body": {
						"type": "BlockStatement",
						"start": 30,
						"end": 44,
						"body": [
							{
								"type": "VariableDeclaration",
								"start": 31,
								"end": 37,
								"declarations": [
									{
										"type": "VariableDeclarator",
										"start": 35,
										"end": 36,
										"id": {
											"type": "Identifier",
											"start": 35,
											"end": 36,
											"name": "a"
										},
										"init": null
									}
								],
								"kind": "var"
							},
							{
								"type": "ExpressionStatement",
								"start": 37,
								"end": 39,
								"expression": {
									"type": "Identifier",
									"start": 37,
									"end": 38,
									"name": "a"
								}
							},
							{
								"type": "ExpressionStatement",
								"start": 39,
								"end": 41,
								"expression": {
									"type": "Identifier",
									"start": 39,
									"end": 40,
									"name": "d"
								}
							},
							{
								"type": "ExpressionStatement",
								"start": 41,
								"end": 43,
								"expression": {
									"type": "Identifier",
									"start": 41,
									"end": 42,
									"name": "c"
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
					kind: "VariableDeclaration",
					tree: tree.body[0],
					declarators: [
						{
							kind: "VariableDeclarator",
							tree: tree.body[0].declarations[0],
							assignment: {
								kind: "ReferenceAssignment",
								tree: tree.body[0].declarations[0].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[0].id,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[0].declarations[0].id
									}
								}
							},
							init: null
						}
					]
				},
				{
					kind: "FunctionDeclaration",
					tree: tree.body[1],
					assignment: {
						kind: "ReferenceAssignment",
						tree: tree.body[1].id,
						reference: {
							kind: "SymbolReference",
							tree: tree.body[1].id,
							symbol: {
								name: "b",
								kind: "var",
								declaration: tree.body[1].id
							}
						}
					},
					params: [
						{
							kind: "ParameterAssignment",
							tree: tree.body[1].params[0],
							assignment: {
								kind: "DefaultAssignment",
								tree: tree.body[1].params[0],
								assignment: {
									kind: "ReferenceAssignment",
									tree: tree.body[1].params[0].left,
									reference: {
										kind: "SymbolReference",
										tree: tree.body[1].params[0].left,
										symbol: {
											name: "c",
											kind: "var",
											declaration: tree.body[1].params[0].left
										}
									}
								},
								defaultValue: {
									kind: "SymbolReference",
									tree: tree.body[1].params[0].right,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[0].declarations[0].id
									}
								}
							}
						},
						{
							kind: "ParameterAssignment",
							tree: tree.body[1].params[1],
							assignment: {
								kind: "DefaultAssignment",
								tree: tree.body[1].params[1],
								assignment: {
									kind: "ReferenceAssignment",
									tree: tree.body[1].params[1].left,
									reference: {
										kind: "SymbolReference",
										tree: tree.body[1].params[1].left,
										symbol: {
											name: "d",
											kind: "var",
											declaration: tree.body[1].params[1].left
										}
									}
								},
								defaultValue: {
									kind: "SymbolReference",
									tree: tree.body[1].params[1].right,
									symbol: {
										name: "c",
										kind: "var",
										declaration: tree.body[1].params[0].left
									}
								}
							}
						}
					],
					body: {
						kind: "Block",
						tree: tree.body[1].body,
						operations: [
							{
								kind: "VariableDeclaration",
								tree: tree.body[1].body.body[0],
								declarators: [
									{
										kind: "VariableDeclarator",
										tree: tree.body[1].body.body[0].declarations[0],
										assignment: {
											kind: "ReferenceAssignment",
											tree: tree.body[1].body.body[0].declarations[0].id,
											reference: {
												kind: "SymbolReference",
												tree: tree.body[1].body.body[0].declarations[0].id,
												symbol: {
													name: "a",
													kind: "var",
													declaration: tree.body[1].body.body[0].declarations[0].id
												}
											}
										},
										init: null
									}
								]
							},
							{
								kind: "Expression",
								tree: tree.body[1].body.body[1],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[1].body.body[1].expression,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[1].body.body[0].declarations[0].id
									}
								}
							},
							{
								kind: "Expression",
								tree: tree.body[1].body.body[2],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[1].body.body[2].expression,
									symbol: {
										name: "d",
										kind: "var",
										declaration: tree.body[1].params[1].left
									}
								}
							},
							{
								kind: "Expression",
								tree: tree.body[1].body.body[3],
								operation: {
									kind: "SymbolReference",
									tree: tree.body[1].body.body[3].expression,
									symbol: {
										name: "c",
										kind: "var",
										declaration: tree.body[1].params[0].left
									}
								}
							}
						]
					}
				}
			]
		});
	});
});

describe('a program containing a variable declaration and an assignment containing member expressions', () => {
	let tree, program;

	beforeEach(() => {
		//for script `var a;a.b = a.c;`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 17,
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
				"end": 16,
				"expression": {
				  "type": "AssignmentExpression",
				  "start": 6,
				  "end": 15,
				  "operator": "=",
				  "left": {
					"type": "MemberExpression",
					"start": 6,
					"end": 9,
					"object": {
					  "type": "Identifier",
					  "start": 6,
					  "end": 7,
					  "name": "a"
					},
					"property": {
					  "type": "Identifier",
					  "start": 8,
					  "end": 9,
					  "name": "b"
					},
					"computed": false
				  },
				  "right": {
					"type": "MemberExpression",
					"start": 12,
					"end": 15,
					"object": {
					  "type": "Identifier",
					  "start": 12,
					  "end": 13,
					  "name": "a"
					},
					"property": {
					  "type": "Identifier",
					  "start": 14,
					  "end": 15,
					  "name": "c"
					},
					"computed": false
				  }
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
								kind: "ReferenceAssignment",
								tree: tree.body[0].declarations[0].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[0].id,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[0].declarations[0].id
									}
								}
							},
							init: null
						}
					]
				},
				{
					kind: "Expression",
					tree: tree.body[1],
					operation: {
						kind: "ValueAssignment",
						tree: tree.body[1].expression,
						value: {
							kind: "MemberReference",
							tree: tree.body[1].expression.right,
							object: {
								kind: "SymbolReference",
								tree: tree.body[1].expression.right.object,
								symbol: {
									name: "a",
									kind: "var",
									declaration: tree.body[0].declarations[0].id
								}
							},
							property: {
								kind: "StaticKey",
								tree: tree.body[1].expression.right.property,
								keyName: "c"
							}
						},
						assignment:{
							kind: "ReferenceAssignment",
							tree: tree.body[1].expression.left,
							reference: {
								kind: "MemberReference",
								tree: tree.body[1].expression.left,
								object: {
									kind: "SymbolReference",
									tree: tree.body[1].expression.left.object,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[0].declarations[0].id
									}
								},
								property: {
									kind: "StaticKey",
									tree: tree.body[1].expression.left.property,
									keyName: "b"
								}
							}
						}
					}
				}
			]
		});
	});
});

describe('a program containing a variable declaration and a computed member expression', () => {
	let tree, program;

	beforeEach(() => {
		//for script `var a, b;a[b]`
		tree = {
			"type": "Program",
			"start": 0,
			"end": 14,
			"body": [
			  {
				"type": "VariableDeclaration",
				"start": 0,
				"end": 9,
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
				  },
				  {
					"type": "VariableDeclarator",
					"start": 7,
					"end": 8,
					"id": {
					  "type": "Identifier",
					  "start": 7,
					  "end": 8,
					  "name": "b"
					},
					"init": null
				  }
				],
				"kind": "var"
			  },
			  {
				"type": "ExpressionStatement",
				"start": 9,
				"end": 13,
				"expression": {
				  "type": "MemberExpression",
				  "start": 9,
				  "end": 13,
				  "object": {
					"type": "Identifier",
					"start": 9,
					"end": 10,
					"name": "a"
				  },
				  "property": {
					"type": "Identifier",
					"start": 11,
					"end": 12,
					"name": "b"
				  },
				  "computed": true,
				  "optional": false
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
					kind: "VariableDeclaration",
					tree: tree.body[0],
					declarators: [
						{
							kind: "VariableDeclarator",
							tree: tree.body[0].declarations[0],
							assignment: {
								kind: "ReferenceAssignment",
								tree: tree.body[0].declarations[0].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[0].id,
									symbol: {
										name: "a",
										kind: "var",
										declaration: tree.body[0].declarations[0].id
									}
								}
							},
							init: null
						},
						{
							kind: "VariableDeclarator",
							tree: tree.body[0].declarations[1],
							assignment: {
								kind: "ReferenceAssignment",
								tree: tree.body[0].declarations[1].id,
								reference: {
									kind: "SymbolReference",
									tree: tree.body[0].declarations[1].id,
									symbol: {
										name: "b",
										kind: "var",
										declaration: tree.body[0].declarations[1].id
									}
								}
							},
							init: null
						}
					]
				},
				{
					kind: "Expression",
					tree: tree.body[1],
					operation: {
						kind: "MemberReference",
						tree: tree.body[1].expression,
						object: {
							kind: "SymbolReference",
							tree: tree.body[1].expression.object,
							symbol: {
								name: "a",
								kind: "var",
								declaration: tree.body[0].declarations[0].id
							}
						},
						property: {
							kind: "KeyComputation",
							tree: tree.body[1].expression.property,
							expression: {
								kind: "SymbolReference",
								tree: tree.body[1].expression.property,
								symbol: {
									name: "b",
									kind: "var",
									declaration: tree.body[0].declarations[1].id
								}
							}
						}
					}
				}
			]
		})
	});
});