var distinct = function(arr){
	return arr.filter(function(x, i){return arr.indexOf(x) === i;});
}
var mapMany = function(arr, mapFn){
	return arr.map(mapFn).reduce(function(a, b){return a.concat(b);}, []);
}

class Interface{
	constructor(name, getChildrenFn, parentInterfaces){
		this.name = name;
		this.getChildrenFn = getChildrenFn;
		this.parentInterfaces = parentInterfaces;
		this.childInterfaces = [];
	}
	addChild(child){
		this.childInterfaces.push(child);
	}
	isAssignableFromNode(n){
		return true;
	}
	getSelfAndParents(){
		var result = [this];
		var parentsParents = mapMany(this.parentInterfaces, function(p){return p.getSelfAndParents();});//this.parentInterfaces.map(function(p){return p.getSelfAndParents();}).reduce(function(a, b){return a.concat(b);}, []);
		result = result.concat(parentsParents);
		result = distinct(result);
		return result;
	}
	isMoreSpecificThan(t){
		if(t.hasChild(this)){
			return true;
		}
		return false;
	}
	getChildren(n){
		var selfAndParents = this.getSelfAndParents();

		return distinct(mapMany(selfAndParents, function(t){return t.getChildrenFn(n.node);}));
	}
	descendsFrom(typeName){
		return this.getSelfAndParents().findIndex(function(t){return t.name === typeName;}) > -1;
	}
	hasChild(t){
		for(var child of this.childInterfaces){
			if(child === t || child.hasChild(t)){
				return true;
			}
		}
		return false;
	}
}
class Type extends Interface{
	constructor(name, test, getChildren, parentInterfaces){
		super(name, getChildren, parentInterfaces);
		this.test = test;
	}
	isAssignableFromNode(n){
		return this.test(n);
	}
	isMoreSpecificThan(n){
		return super.isMoreSpecificThan(n) || n.test === undefined;
	}
}
class NamedType extends Type{
	constructor(typeName, name, getChildren, parentInterfaces){
		super(name, (n) => n.type === typeName, getChildren, parentInterfaces);
	}
}
class NamedSubType extends Type{
	constructor(typeName, test, name, getChildren, parentInterfaces){
		super(name, (n) => n.type === typeName && test(n), getChildren, parentInterfaces);
	}
}
class InterfaceCollection{
	constructor(){
		this.interfaces = [];
	}
	getInterfaces(names){
		var result = this.interfaces.filter(function(i){return names.includes(i.name);});
		if(result.length !== names.length){
			throw new Error(`not all interfaces ${JSON.stringify(names)} are known yet`);
		}
		return result;
	}
	addChildToParents(child, parents){
		for(var parent of parents){
			parent.addChild(child);
		}
	}
	add(parentInterfaces, getNewInterface){
		parentInterfaces = this.getInterfaces(parentInterfaces);
		var newInterface = getNewInterface(parentInterfaces);
		if(this.interfaces.findIndex(function(i){return i.name === newInterface.name;}) > -1){
			throw new Error(`inteface '${newInterface.name}' is already defined`)
		}
		this.addChildToParents(newInterface, parentInterfaces);
		this.interfaces.push(newInterface);
	}
	addInterface(name, getChildren, parentInterfaces){
		this.add(parentInterfaces, function(p){return new Interface(name, getChildren, p);});
	}
	addType(name, test, getChildren, parentInterfaces){
		this.add(parentInterfaces, function(p){return new Type(name, test, getChildren, p);});
	}
	addNamedType(typeName, getChildren, parentInterfaces){
		this.add(parentInterfaces, function(p){return new NamedType(typeName, typeName, getChildren, p);});
	}
	addNamedSubType(name, typeName, test, getChildren, parentInterfaces){
		this.add(parentInterfaces, function(p){return new NamedSubType(typeName, test, name, getChildren, p);});
	}
	getNodeType(node){
		var types = this.interfaces.filter(function(i){return i.isAssignableFromNode(node);});
		if(!types.length){
			throw new Error(`${JSON.stringify(node.type)} is not a known type`)
		}
		var mostSpecific = types.filter(function(t){return types.findIndex(function(tt){return tt.isMoreSpecificThan(t);}) === -1;});
		if(mostSpecific.length > 1){
			throw new Error(`For node of type ${node.type}, cannot decide to which of ${mostSpecific.map(function(t){return t.name}).join(', ')} to assign`);
		}
		return mostSpecific[0];
	}
	getChildren(node){
		return this.getNodeType(node).getChildren(node);
	}
	findVisitorMethod(node, visitor){
		var nodeType = this.getNodeType(node);
		var eligibleTypes = [nodeType];
		var counter = 0;
		while(counter < 10){
			var eligibleMethod;
			var eligibleMethodName;
			//console.log(`looking at types ${eligibleTypes.map(function(t){return t.name}).join(', ')}`);
			for(var type of eligibleTypes){
				var visitorMethod = visitor[type.name];
				if(visitorMethod && eligibleMethod){
					throw new Error(`For node of type ${node.type}, cannot decide between methods '${eligibleMethodName}' and '${type.name}'`)
				}
				if(visitorMethod){
					eligibleMethod = visitorMethod;
					eligibleMethodName = type.name;
				}
			}
			if(eligibleMethod){
				//console.log(`found method by name '${eligibleMethodName}'`);
				return eligibleMethod;
			}
			eligibleTypes = mapMany(eligibleTypes, function(t){return t.parentInterfaces;}); //eligibleTypes.map(function(t){return t.parentInterfaces;}).reduce(function(a, b){return a.concat(b);}, []);
			eligibleTypes = distinct(eligibleTypes);//eligibleTypes.filter(function(t, i){return eligibleTypes.indexOf(t) === i;});
			if(eligibleTypes.length === 0){
				//console.log(`found no visitor method`)
				return undefined;
			}
			counter++;
		}
	}
	getNewVisitor(node, visitor){
		var visitorMethod = this.findVisitorMethod(node, visitor);
		if(!visitorMethod){
			return visitor;
		}
		return visitorMethod.apply(visitor, [node]);
	}
}

var collection = new InterfaceCollection();

class NodeWrapper{
	constructor(node, parent){
		this.node = node;
		this.parent = parent;
	}
	get type(){return this.node.type;}
	hasParentOfType(typeName){
		if(!this.parent){
			return false;
		}
		var parentType = collection.getNodeType(this.parent);
		return parentType.descendsFrom(typeName);
	}
}



var noChildren = function(){return [];};
var maybe = function(n){return n ? [n] : [];};

//es5
collection.addInterface("Node", noChildren, []);
collection.addInterface("Expression", noChildren, ["Node"]);
collection.addNamedType("Program", function(n){return n.body;}, ["Node"]);
collection.addInterface("Statement", noChildren, ["Node"]);
collection.addInterface("Function", function(n){return n.params.concat([n.body]).concat(maybe(n.id))}, ["Node"]);
collection.addType("ExpressionStatement", function(n){return n.type === "ExpressionStatement" && n.node.directive === undefined;}, function(n){return [n.expression];}, ["Statement"]);
collection.addType("Directive", function(n){return n.type === "ExpressionStatement" && n.node.directive !== undefined;}, function(n){return [n.expression];}, ["Node"]);
collection.addNamedType("Literal", noChildren, ["Expression"]);
collection.addNamedType("BlockStatement", function(n){return n.body;}, ["Statement"]);
collection.addInterface("Pattern", noChildren, ["Node"]);
collection.addNamedType("Identifier", noChildren, ["Expression", "Pattern"]);
collection.addNamedSubType("RegExpLiteral", "Literal", function(n){return n.node.regex !== undefined;}, noChildren, ["Literal"]);
collection.addNamedSubType("FunctionBody", "BlockStatement", function(n){return n.hasParentOfType("Function");}, noChildren, ["BlockStatement"]);
collection.addNamedType("EmptyStatement", noChildren, ["Statement"]);
collection.addNamedType("DebuggerStatement", noChildren, ["Statement"]);
collection.addNamedType("WithStatement", function(n){return [n.object, n.body];}, ["Statement"]);
collection.addNamedType("ReturnStatement", function(n){return maybe(n.argument);}, ["Statement"]);
collection.addNamedType("LabeledStatement", function(n){return [n.label, n.body];}, ["Statement"]);
collection.addNamedType("BreakStatement", function(n){return maybe(n.label);}, ["Statement"]);
collection.addNamedType("ContinueStatement", function(n){return maybe(n.label);}, ["Statement"]);
collection.addNamedType("IfStatement", function(n){return [n.test, n.consequent].concat(maybe(n.alternate));}, ["Statement"]);
collection.addNamedType("SwitchStatement", function(n){return n.cases.concat([n.discriminant]);}, ["Statement"]);
collection.addNamedType("SwitchCase", function(n){return n.consequent.concat(maybe(n.test));}, ["Node"]);
collection.addNamedType("ThrowStatement", function(n){return [n.argument];}, ["Statement"]);
collection.addNamedType("TryStatement", function(n){return [n.block].concat(maybe(n.handler)).concat(maybe(n.finalizer));}, ["Statement"]);
collection.addNamedType("CatchClause", function(n){return [n.body].concat(maybe(n.param));}, ["Node"]);
collection.addNamedType("WhileStatement", function(n){return [n.test, n.body];}, ["Statement"]);
collection.addNamedType("DoWhileStatement", function(n){return [n.test, n.body];}, ["Statement"]);
collection.addNamedType("ForStatement", function(n){return [n.body].concat(maybe(n.init)).concat(maybe(n.test)).concat(maybe(n.update));}, ["Statement"]);
collection.addNamedType("ForInStatement", function(n){return [n.left, n.right, n.body];}, ["Statement"]);
collection.addInterface("Declaration", noChildren, ["Statement"]);
collection.addType("FunctionDeclaration", function(n){return n.type === "FunctionDeclaration" && n.node.id !== null;}, noChildren, ["Function", "Declaration"]);
collection.addNamedType("VariableDeclaration", function(n){return n.declarations;}, ["Declaration"]);
collection.addNamedType("VariableDeclarator", function(n){return [n.id].concat(maybe(n.init));}, ["Node"]);
collection.addNamedType("ThisExpression", noChildren, ["Expression"]);
collection.addNamedType("ArrayExpression", function(n){return n.elements.filter(function(e){return !!e;})}, ["Expression"]);
collection.addNamedType("ObjectExpression", function(n){return n.properties;}, ["Expression"]);
collection.addNamedType("Property", function(n){return [n.key, n.value];}, ["Node"]);
collection.addNamedType("FunctionExpression", noChildren, ["Function", "Expression"]);
collection.addNamedType("UnaryExpression", function(n){return [n.argument];}, ["Expression"]);
collection.addNamedType("UpdateExpression", function(n){return [n.argument];}, ["Expression"]);
collection.addNamedType("BinaryExpression", function(n){return [n.left, n.right];}, ["Expression"]);
collection.addNamedType("AssignmentExpression", function(n){return [n.left, n.right];}, ["Expression"]);
collection.addNamedType("LogicalExpression", function(n){return [n.left, n.right];}, ["Expression"]);
collection.addNamedType("MemberExpression", function(n){return [n.object, n.property];}, ["Expression", "Pattern"]);
collection.addNamedType("ConditionalExpression", function(n){return [n.test, n.alternate, n.consequent];}, ["Expression"]);
collection.addNamedType("CallExpression", function(n){return n.arguments.concat([n.callee]);}, ["Expression"]);
collection.addNamedType("NewExpression", function(n){return n.arguments.concat([n.callee]);}, ["Expression"]);
collection.addNamedType("SequenceExpression", function(n){return n.expressions;}, ["Expression"]);

//es2015
collection.addNamedType("ForOfStatement", noChildren, ["ForInStatement"]);
collection.addNamedType("Super", noChildren, ["Node"]);
collection.addNamedType("SpreadElement", function(n){return [n.argument];}, ["Node"]);
collection.addNamedType("ArrowFunctionExpression", noChildren, ["Function", "Expression"]);
collection.addNamedType("YieldExpression", function(n){return [n.argument];}, ["Expression"]);
collection.addNamedType("TemplateLiteral", function(n){return n.quasis.concat(n.expressions);}, ["Expression"]);
collection.addNamedType("TaggedTemplateExpression", function(n){return [n.tag, n.quasi];}, ["Expression"]);
collection.addNamedType("TemplateElement", noChildren, ["Node"]);
collection.addNamedType("ObjectPattern", function(n){return n.properties;}, ["Pattern"]);
collection.addNamedSubType("AssignmentProperty", "Property", function(n){return n.hasParentOfType("ObjectPattern");}, noChildren, ["Property"]);
collection.addNamedType("ArrayPattern", function(n){return n.elements.filter(function(e){return !!e;})}, ["Pattern"]);
collection.addNamedType("RestElement", function(n){return [n.argument];}, ["Pattern"]);
collection.addNamedType("AssignmentPattern", function(n){return [n.left, n.right];}, ["Pattern"]);
collection.addInterface("Class", function(n){return [n.body].concat(maybe(n.id)).concat(maybe(n.superClass));}, ["Node"]);
collection.addNamedType("ClassBody", function(n){return n.body;}, ["Node"]);
collection.addNamedType("MethodDefinition", function(n){return [n.key, n.value];}, ["Node"]);
collection.addType("ClassDeclaration", function(n){return n.type === "ClassDeclaration" && n.node.id !== null;}, noChildren, ["Class", "Declaration"]);
collection.addNamedType("ClassExpression", noChildren, ["Class", "Expression"]);
collection.addNamedType("MetaProperty", function(n){return [n.meta, n.property];}, ["Expression"]);
collection.addInterface("ModuleDeclaration", noChildren, ["Node"]);
collection.addInterface("ModuleSpecifier", function(n){return [n.local];}, ["Node"]);
collection.addNamedType("ImportDeclaration", function(n){return [n.source].concat(n.specifiers);}, ["ModuleDeclaration"]);
collection.addNamedType("ImportSpecifier", function(n){return [n.imported];}, ["ModuleSpecifier"]);
collection.addNamedType("ImportDefaultSpecifier", noChildren, ["ModuleSpecifier"]);
collection.addNamedType("ImportNamespaceSpecifier", noChildren, ["ModuleSpecifier"]);
collection.addNamedType("ExportNamedDeclaration", function(n){return n.specifiers.concat(maybe(n.declaration)).concat(maybe(n.source))}, ["ModuleDeclaration"]);
collection.addNamedType("ExportSpecifier", function(n){return [n.exported];}, ["ModuleSpecifier"]);
collection.addNamedType("ExportDefaultDeclaration", function(n){return [n.declaration]}, ["ModuleDeclaration"]);
collection.addType("AnonymousDefaultExportedFunctionDeclaration", function(n){return n.type === "FunctionDeclaration" && n.node.id === null && n.hasParentOfType("ExportDefaultDeclaration");}, noChildren, ["Function"]);
collection.addType("AnonymousDefaultExportedClassDeclaration", function(n){return n.type === "ClassDeclaration" && n.node.id === null && n.hasParentOfType("ExportDefaultDeclaration");}, noChildren, ["Class"]);
collection.addNamedType("ExportAllDeclaration", function(n){return [n.source];}, ["ModuleDeclaration"]);

//es2017
collection.addNamedType("AwaitExpression", function(n){return [n.argument];}, ["Expression"]);

//es2020
collection.addNamedSubType("BigIntLiteral", "Literal", function(n){return n.node.bigint !== undefined;}, noChildren, ["Literal"]);



var visit = function(node, visitor){
	(function continuation(node, visitor, parentNode){
		var children = collection.getChildren(node);
		for(var child of children){
			var childWrapped = new NodeWrapper(child, node);
			var newVisitor = collection.getNewVisitor(childWrapped, visitor);
			if(!newVisitor){
				return false;
			}
			if(!continuation(childWrapped, newVisitor)){
				return false;
			}
		}
		return true;
	})(new NodeWrapper(node), visitor);
};

export {visit};