export default [

	//es5
	{
		name: "Node"
	},
	{
		name: "Expression",
		extends: ["Node"]
	},
	{
		typeName: "Program",
		*children(n){
			yield* n.body;
		},
		extends: ["Node"]
	},
	{
		name: "Statement",
		extends: ["Node"]
	},
	{
		name: "Function",
		*children(n){
			yield* n.params;
			yield n.body;
			yield n.id;
		},
		extends: ["Node"]
	},
	{
		name: "ExpressionStatement",
		test(n){
			return n.type === "ExpressionStatement" && n.node.directive === undefined;
		},
		*children(n){
			yield n.expression;
		},
		extends: ["Statement"]
	},
	{
		name: "Directive",
		test(n){
			return n.type === "ExpressionStatement" && n.node.directive !== undefined;
		},
		*children(n){
			yield n.expression;
		},
		extends: ["Node"]
	},
	{
		typeName: "Literal",
		extends: ["Expression"]
	},
	{
		typeName: "BlockStatement",
		*children(n){
			yield* n.body;
		},
		extends: ["Statement"]
	},
	{
		name: "Pattern",
		extends: ["Node"]
	},
	{
		typeName: "Identifier",
		extends: ["Expression", "Pattern"]
	},
	{
		name: "RegExpLiteral",
		test(n){
			return n.node.regex !== undefined;
		},
		extends: ["Literal"]
	},
	{
		name: "FunctionBody",
		test(n){
			return n.hasParentOfType("Function");
		},
		extends: ["BlockStatement"]
	},
	{
		typeName: "EmptyStatement",
		extends: ["Statement"]
	},
	{
		typeName: "DebuggerStatement",
		extends: ["Statement"]
	},
	{
		typeName: "WithStatement",
		*children(n){
			yield n.object;
			yield n.body;
		},
		extends: ["Statement"]
	},
	{
		typeName: "ReturnStatement",
		*children(n){
			yield n.argument;
		},
		extends: ["Statement"]
	},
	{
		typeName: "LabeledStatement",
		*children(n){
			yield n.label;
			yield n.body;
		},
		extends: ["Statement"]
	},
	{
		typeName: "BreakStatement",
		*children(n){
			yield n.label;
		},
		extends: ["Statement"]
	},
	{
		typeName: "ContinueStatement",
		*children(n){
			yield n.label;
		},
		extends: ["Statement"]
	},
	{
		typeName: "IfStatement",
		*children(n){
			yield n.test;
			yield n.consequent;
			yield n.alternate;
		},
		extends: ["Statement"]
	},
	{
		typeName: "SwitchStatement",
		*children(n){
			yield n.discriminant;
			yield* n.cases;
		},
		extends: ["Statement"]
	},
	{
		typeName: "SwitchCase",
		*children(n){
			yield* n.consequent;
			yield n.test;
		},
		extends: ["Node"]
	},
	{
		typeName: "ThrowStatement",
		*children(n){
			yield n.argument;
		},
		extends: ["Statement"]
	},
	{
		typeName: "TryStatement",
		*children(n){
			yield n.block;
			yield n.handler;
			yield n.finalizer;
		},
		extends: ["Statement"]
	},
	{
		typeName: "CatchClause",
		*children(n){
			yield n.body;
			yield n.param;
		},
		extends: ["Node"]
	},
	{
		typeName: "WhileStatement",
		*children(n){
			yield n.test;
			yield n.body;
		},
		extends: ["Statement"]
	},
	{
		typeName: "DoWhileStatement",
		*children(n){
			yield n.test;
			yield n.body;
		},
		extends: ["Statement"]
	},
	{
		typeName: "ForStatement",
		*children(n){
			yield n.body;
			yield n.init;
			yield n.test;
			yield n.update;
		},
		extends: ["Statement"]
	},
	{
		name: "ForInStatement",
		test(n){
			return n.type === "ForInStatement" || n.type === "ForOfStatement";
		},
		*children(n){
			yield n.left;
			yield n.right;
			yield n.body;
		},
		extends: ["Statement"]
	},
	{
		name: "Declaration",
		extends: ["Statement"]
	},
	{
		name: "FunctionDeclaration",
		test(n){
			return n.type === "FunctionDeclaration" && n.node.id !== null;
		},
		extends: ["Function", "Declaration"]
	},
	{
		typeName: "VariableDeclaration",
		*children(n){
			yield* n.declarations;
		},
		extends: ["Declaration"]
	},
	{
		typeName: "VariableDeclarator",
		*children(n){
			yield n.id;
			yield n.init;
		},
		extends: ["Node"]
	},
	{
		typeName: "ThisExpression",
		extends: ["Expression"]
	},
	{
		typeName: "ArrayExpression",
		*children(n){
			yield* n.elements;
		},
		extends: ["Expression"]
	},
	{
		typeName: "ObjectExpression",
		*children(n){
			yield* n.properties;
		},
		extends: ["Expression"]
	},
	{
		typeName: "Property",
		*children(n){
			yield n.key;
			yield n.value;
		},
		extends: ["Node"]
	},
	{
		typeName: "FunctionExpression",
		extends: ["Function", "Expression"]
	},
	{
		typeName: "UnaryExpression",
		*children(n){
			yield n.argument;
		},
		extends: ["Expression"]
	},
	{
		typeName: "UpdateExpression",
		*children(n){
			yield n.argument;
		},
		extends: ["Expression"]
	},
	{
		typeName: "BinaryExpression",
		*children(n){
			yield n.left;
			yield n.right;
		},
		extends: ["Expression"]
	},
	{
		typeName: "AssignmentExpression",
		*children(n){
			yield n.left;
			yield n.right;
		},
		extends: ["Expression"]
	},
	{
		typeName: "LogicalExpression",
		*children(n){
			yield n.left;
			yield n.right;
		},
		extends: ["Expression"]
	},
	{
		name: "ChainElement",
		extends: ["Node"]
	},
	{
		typeName: "MemberExpression",
		*children(n){
			yield n.object;
			yield n.property;
		},
		extends: ["Expression", "Pattern", "ChainElement"]
	},
	{
		typeName: "ConditionalExpression",
		*children(n){
			yield n.test;
			yield n.alternate;
			yield n.consequent;
		},
		extends: ["Expression"]
	},
	{
		typeName: "CallExpression",
		*children(n){
			yield* n.arguments;
			yield n.callee;
		},
		extends: ["Expression", "ChainElement"]
	},
	{
		typeName: "NewExpression",
		*children(n){
			yield* n.arguments;
			yield n.callee;
		},
		extends: ["Expression"]
	},
	{
		typeName: "SequenceExpression",
		*children(n){
			yield* n.expressions;
		},
		extends: ["Expression"]
	},

	//es2015
	{
		typeName: "ForOfStatement",
		extends: ["ForInStatement"]
	},
	{
		typeName: "Super",
		extends: ["Node"]
	},
	{
		typeName: "SpreadElement",
		*children(n){
			yield n.argument;
		},
		extends: ["Node"]
	},
	{
		typeName: "ArrowFunctionExpression",
		extends: ["Function", "Expression"]
	},
	{
		typeName: "YieldExpression",
		*children(n){
			yield n.argument;
		},
		extends: ["Expression"]
	},
	{
		typeName: "TemplateLiteral",
		*children(n){
			yield* n.quasis;
			yield* n.expressions;
		},
		extends: ["Expression"]
	},
	{
		typeName: "TaggedTemplateExpression",
		*children(n){
			yield n.tag;
			yield n.quasi;
		},
		extends: ["Expression"]
	},
	{
		typeName: "TemplateElement",
		extends: ["Node"]
	},
	{
		typeName: "ObjectPattern",
		*children(n){
			yield* n.properties;
		},
		extends: ["Pattern"]
	},
	{
		name: "AssignmentProperty",
		test(n){
			return n.hasParentOfType("ObjectPattern");
		},
		extends: ["Property"]
	},
	{
		typeName: "ArrayPattern",
		*children(n){
			yield* n.elements;
		},
		extends: ["Pattern"]
	},
	{
		typeName: "RestElement",
		*children(n){
			yield n.argument;
		},
		extends: ["Pattern"]
	},
	{
		typeName: "AssignmentPattern",
		*children(n){
			yield n.left;
			yield n.right;
		},
		extends: ["Pattern"]
	},
	{
		name: "Class",
		*children(n){
			yield n.body;
			yield n.superClass;
			yield n.id;
		},
		extends: ["Node"]
	},
	{
		typeName: "ClassBody",
		*children(n){
			yield* n.body;
		},
		extends: ["Node"]
	},
	{
		typeName: "MethodDefinition",
		*children(n){
			yield n.key;
			yield n.value;
		},
		extends: ["Node"]
	},
	{
		name: "ClassDeclaration",
		test(n){
			return n.type === "ClassDeclaration" && n.node.id !== null;
		},
		extends: ["Class", "Declaration"]
	},
	{
		typeName: "ClassExpression",
		extends: ["Class", "Expression"]
	},
	{
		typeName: "MetaProperty",
		*children(n){
			yield n.meta;
			yield n.property;
		},
		extends: ["Expression"]
	},
	{
		name: "ModuleDeclaration",
		extends: ["Node"]
	},
	{
		name: "ModuleSpecifier",
		*children(n){
			yield n.local;
		},
		extends: ["Node"]
	},
	{
		typeName: "ImportDeclaration",
		*children(n){
			yield n.source;
			yield* n.specifiers;
		},
		extends: ["ModuleDeclaration"]
	},
	{
		typeName: "ImportSpecifier",
		*children(n){
			yield n.imported;
		},
		extends: ["ModuleSpecifier"]
	},
	{
		typeName: "ImportDefaultSpecifier",
		extends: ["ModuleSpecifier"]
	},
	{
		typeName: "ImportNamespaceSpecifier",
		extends: ["ModuleSpecifier"]
	},
	{
		typeName: "ExportNamedDeclaration",
		*children(n){
			yield* n.specifiers;
			yield n.declaration;
			yield n.source;
		},
		extends: ["ModuleDeclaration"]
	},
	{
		typeName: "ExportSpecifier",
		*children(n){
			yield n.exported;
		},
		extends: ["ModuleSpecifier"]
	},
	{
		typeName: "ExportDefaultDeclaration",
		*children(n){
			yield n.declaration;
		},
		extends: ["ModuleDeclaration"]
	},
	{
		name: "AnonymousDefaultExportedFunctionDeclaration",
		test(n){
			return n.type === "FunctionDeclaration" && n.node.id === null && n.hasParentOfType("ExportDefaultDeclaration");
		},
		extends: ["Function"]
	},
	{
		name: "AnonymousDefaultExportedClassDeclaration",
		test(n){
			return n.type === "ClassDeclaration" && n.node.id === null && n.hasParentOfType("ExportDefaultDeclaration");
		},
		extends: ["Class"]
	},
	{
		typeName: "ExportAllDeclaration",
		*children(n){
			yield n.source;
			yield n.exported;
		},
		extends: ["ModuleDeclaration"]
	},

	//es2017
	{
		typeName: "AwaitExpression",
		*children(n){
			yield n.argument;
		},
		extends: ["Expression"]
	},

	//es2020
	{
		name: "BigIntLiteral",
		test(n){
			return n.node.bigint !== undefined;
		},
		extends: ["Literal"]
	},
	{
		typeName: "ChainExpression",
		*children(n){
			yield n.expression;
		},
		extends: ["Expression"]
	},
	{
		typeName: "ImportExpression",
		*children(n){
			yield n.source;
		},
		extends: ["Expression"]
	}
];