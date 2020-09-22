import {visit} from './visit';
import {
	ObjectDestructuringAssignmentOperation,
	ArrayDestructuringAssignmentOperation,
	PropertyDestructuringAssignmentOperation,
	DefaultAssignmentOperation,
	RestElementAssignmentOperation,
	ReferenceAssignmentOperation,
	SymbolReferenceOperation,
	ParameterAssignmentOperation,
	VariableDeclaratorOperation,
	VariableDeclarationOperation,
	FunctionDeclarationOperation,
	ExpressionOperation,
	BlockOperation,
	Program,
	ValueAssignmentOperation,
	LiteralOperation,
	ObjectOperation,
	ObjectPropertyOperation,
	StaticKeyOperation,
	MemberReferenceOperation,
	KeyComputationOperation} from './operations'

class Symbol{
	constructor(identifier, kind) {
		this.name = identifier.name;
		this.declaration = identifier;
		this.kind = kind;
	}
}

class BlockScope{
	constructor(parentScope){
		this.parentScope = parentScope;
		this.symbols = [];
	}
	declareSymbol(id, kind){
		this.symbols.push(new Symbol(id, kind));
	}
	getSymbol(name){
		for(var symbol of this.symbols){
			if(symbol.name === name){
				return symbol;
			}
		}
		if(this.parentScope){
			return this.parentScope.getSymbol(name);
		}
	}
	createBlockScope(){
		return new BlockScope(this);
	}
	createFunctionScope(){
		return new FunctionScope(this);
	}
}

class FunctionScope extends BlockScope{

}

class SymbolReferencer{
	constructor(scope) {
		this.scope = scope;
	}
	referToSymbolByIdentifier(id){}
	getSymbolReference(id){
		var symbol = this.scope.getSymbol(id.name);
		return new SymbolReferenceOperation(id, symbol);
	}
}

class DeclaringSymbolReferencer extends SymbolReferencer{
	constructor(scope, kind){
		super(scope);
		this.kind = kind;
	}
	referToSymbolByIdentifier(id){
		this.scope.declareSymbol(id, this.kind);
	}
}

class VariableDeclarationVisitor{
	constructor(scope, idReferencer, initReferencer, tree){
		this.scope = scope;
		this.idReferencer = idReferencer;
		this.initReferencer = initReferencer;
		this.tree = tree;
		this.declaratorVisitors = [];
	}
	getOperation(){
		return new VariableDeclarationOperation(this.tree, this.declaratorVisitors.map(v => v.getOperation()));
	}
	VariableDeclarator(node){
		var visitor = new VariableDeclaratorVisitor(this.scope, this.idReferencer, this.initReferencer, node);
		this.declaratorVisitors.push(visitor);
		return visitor;
	}
}

class VariableDeclaratorVisitor{
	constructor(scope, idReferencer, initReferencer, tree){
		this.scope = scope;
		this.tree = tree;
		this.idReferencer = idReferencer;
		this.initReferencer = initReferencer;
		this.idVisitor = undefined;
		this.initVisitor = undefined;
	}

	getOperation(){
		return new VariableDeclaratorOperation(this.tree, this.idVisitor.getOperation(), this.initVisitor ? this.initVisitor.getOperation() : null);
	}

	Pattern(node, useVisitor){
		var visitor = new AssignmentTargetPatternVisitor(this.scope, this.idReferencer);
		this.idVisitor = visitor;
		return useVisitor(visitor);
	}

	Identifier(node, useVisitor){
		if(node === this.tree.id){
			var visitor = new AssignmentTargetPatternVisitor(this.scope, this.idReferencer);
			this.idVisitor = visitor;
			return useVisitor(visitor);
		}
		var visitor = new ExpressionVisitor(this.scope, this.initReferencer);
		this.initVisitor = visitor;
		return useVisitor(visitor);
	}

	Expression(node, useVisitor){
		var visitor = new ExpressionVisitor(this.scope, this.initReferencer);
		this.initVisitor = visitor;
		return useVisitor(visitor);
	}
}

class AssignmentTargetPatternVisitor{
	constructor(scope, referencer){
		this.scope = scope;
		this.referencer = referencer;
		this.operationFn = undefined;
	}
	getOperation(){
		return this.operationFn();
	}
	Identifier(node){
		this.referencer.referToSymbolByIdentifier(node);
		this.operationFn = () => {
			var symbolReference = this.referencer.getSymbolReference(node);
			return new ReferenceAssignmentOperation(node, symbolReference);
		};
	}
	MemberExpression(node){
		var visitor = new MemberExpressionVisitor(node, this.scope, this.referencer);
		this.operationFn = () => {
			return new ReferenceAssignmentOperation(node, visitor.getOperation());
		};
		return visitor;
	}
	RestElement(node){
		var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
		this.operationFn = () => {
			return new RestElementAssignmentOperation(node, visitor.getOperation());
		};
		return visitor;
	}
	ObjectPattern(node){
		var visitor = new ObjectPatternVisitor(this.scope, this.referencer, node);
		this.operationFn = () => {
			return visitor.getOperation();
		};
		return visitor;
	}
	ArrayPattern(node){
		var visitor = new ArrayPatternVisitor(this.scope, this.referencer, node);
		this.operationFn = () => {
			return visitor.getOperation();
		};
		return visitor;
	}
	AssignmentPattern(node){
		var visitor = new AssignmentPatternVisitor(this.scope, this.referencer, node);
		this.operationFn = () => {
			return visitor.getOperation();
		};
		return visitor;
	}
}

class AssignmentPatternVisitor{
	constructor(scope, referencer, tree){
		this.scope = scope;
		this.referencer = referencer;
		this.tree = tree;
		this.leftVisitor = undefined;
		this.rightVisitor = undefined;
	}

	getOperation(){
		return new DefaultAssignmentOperation(this.tree, this.leftVisitor.getOperation(), this.rightVisitor.getOperation());
	}

	Expression(node, useVisitor){
		var visitor = new ExpressionVisitor(this.scope, this.referencer);
		this.rightVisitor = visitor;
		return useVisitor(this.rightVisitor);
	}

	Identifier(node, useVisitor){
		if(node === this.tree.left){
			var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
			this.leftVisitor = visitor;
			return useVisitor(visitor);
		}
		var visitor = new ExpressionVisitor(this.scope, this.referencer);
		this.rightVisitor = visitor;
		return useVisitor(this.rightVisitor);
	}

	Pattern(node, useVisitor){
		var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
		this.leftVisitor = visitor;
		return useVisitor(visitor);
	}
}

class PropertyAssignmentVisitor{
	constructor(scope, referencer, tree){
		this.scope = scope;
		this.referencer = referencer;
		this.tree = tree;
		this.valueVisitor = undefined;
		this.keyOperationFn = undefined;
	}

	getOperation(){
		return new PropertyDestructuringAssignmentOperation(this.tree, this.valueVisitor.getOperation(), this.keyOperationFn())
	}

	Pattern(node, useVisitor){
		if(node === this.tree.key){
			if(this.tree.computed){
				var visitor = new ExpressionVisitor(this.scope, this.referencer);
				this.keyOperationFn = () => new KeyComputationOperation(node, visitor.getOperation());
				return useVisitor(visitor);
			}else{
				// should never happen, because a uncomputed key cannot be any other pattern than an identifier
			}
		}else{
			var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
			this.valueVisitor = visitor;
			return useVisitor(visitor);
		}
	}

	Identifier(node, useVisitor){
		if(node === this.tree.key){
			if(this.tree.computed){
				var visitor = new ExpressionVisitor(this.scope, this.referencer);
				this.keyOperationFn = () => new KeyComputationOperation(node, visitor.getOperation());
				return useVisitor(visitor);
			}else{
				this.keyOperationFn = () => new StaticKeyOperation(node, node.name);
			}
		}else{
			var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
			this.valueVisitor = visitor;
			return useVisitor(visitor);
		}
	}
}

class ObjectPatternVisitor{
	constructor(scope, referencer, tree){
		this.scope = scope;
		this.tree = tree;
		this.referencer = referencer;
		this.propertyVisitors = [];
	}

	getOperation(){
		return new ObjectDestructuringAssignmentOperation(this.tree, this.propertyVisitors.map(v => v.getOperation()))
	}

	Property(node){
		var visitor = new PropertyAssignmentVisitor(this.scope, this.referencer, node);
		this.propertyVisitors.push(visitor);
		return visitor;
	}
}

class ArrayPatternVisitor{
	constructor(scope, referencer, tree){
		this.scope = scope;
		this.tree = tree;
		this.referencer = referencer;
		this.assignmentVisitors = [];
	}

	getOperation(){
		return new ArrayDestructuringAssignmentOperation(this.tree, this.assignmentVisitors.map(v => v.getOperation()));
	}

	Pattern(node, useVisitor){
		var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
		this.assignmentVisitors.push(visitor);
		return useVisitor(visitor);
	}
}

class FunctionDeclarationVisitor{
	constructor(tree, scope, referencer){
		this.scope = scope;
		this.referencer = referencer;
		this.tree = tree;
		this.parameterScope = scope.createBlockScope();
		this.functionScope = this.parameterScope.createFunctionScope();
		this.parameterFns = [];
		this.blockVisitor = undefined;
	}

	getOperation(){
		var assignment = new ReferenceAssignmentOperation(this.tree.id, this.referencer.getSymbolReference(this.tree.id));
		return new FunctionDeclarationOperation(this.tree, assignment, this.parameterFns.map(fn => fn()), this.blockVisitor.getOperation());
	}

	FunctionBody(node){
		var visitor = new BlockVisitor(this.functionScope, node);
		this.blockVisitor = visitor;
		return visitor;
	}

	Pattern(node, useVisitor){
		if(node === this.tree.id){
			this.referencer.referToSymbolByIdentifier(node);
		}else{
			var visitor = new AssignmentTargetPatternVisitor(this.scope, new DeclaringSymbolReferencer(this.parameterScope, 'var'));
			this.parameterFns.push(() => new ParameterAssignmentOperation(node, visitor.getOperation()));
			return useVisitor(visitor);
		}
	}
}

class MemberExpressionVisitor{
	constructor(tree, scope, referencer) {
		this.tree = tree;
		this.scope = scope;
		this.referencer = referencer;
		this.propertyOperationFn = undefined;
		this.objectVisitor = undefined;
	}

	getOperation(){
		return new MemberReferenceOperation(this.tree, this.objectVisitor.getOperation(), this.propertyOperationFn());
	}

	Expression(node){
		//TODO an expression that's not an identifier
	}

	Identifier(node, useVisitor){
		if(node === this.tree.property){
			if(this.tree.computed){
				var visitor = new ExpressionVisitor(this.scope, this.referencer);
				this.propertyOperationFn = () => new KeyComputationOperation(node, visitor.getOperation());
				return useVisitor(visitor);
			}else{
				this.propertyOperationFn = () => new StaticKeyOperation(node, node.name);
			}
		}else{
			var visitor = new ExpressionVisitor(this.scope, this.referencer);
			this.objectVisitor = visitor;
			return useVisitor(visitor);
		}
	}
}

class ExpressionVisitor{
	constructor(scope, referencer) {
		this.scope = scope;
		this.referencer = referencer;
		this.operationFn = undefined;
	}

	getOperation(){
		var result = this.operationFn();
		return result;
	}

	Identifier(node){
		this.operationFn = () => this.referencer.getSymbolReference(node);
	}

	Literal(node){
		this.operationFn = () => new LiteralOperation(node);
	}

	MemberExpression(node){
		var visitor = new MemberExpressionVisitor(node, this.scope, this.referencer);
		this.operationFn = () => visitor.getOperation();
		return visitor;
	}

	AssignmentExpression(node){
		var visitor = new AssignmentExpressionVisitor(node, this.scope, this.referencer);
		this.operationFn = () => visitor.getOperation();
		return visitor;
	}

	ObjectExpression(node){
		var visitor = new ObjectExpressionVisitor(node, this.scope, this.referencer);
		this.operationFn = () => visitor.getOperation();
		return visitor;
	}
}

class ObjectExpressionVisitor{
	constructor(tree, scope, referencer) {
		this.tree = tree;
		this.scope = scope;
		this.referencer = referencer;
		this.propertyVisitors = [];
	}

	getOperation(){
		return new ObjectOperation(this.tree, this.propertyVisitors.map(v => v.getOperation()))
	}

	Property(node){
		var visitor = new PropertyVisitor(node, this.scope, this.referencer);
		this.propertyVisitors.push(visitor);
		return visitor;
	}
}

class PropertyVisitor{
	constructor(tree, scope, referencer) {
		this.tree = tree;
		this.scope = scope;
		this.referencer = referencer;
		this.valueVisitor = undefined;
	}

	getOperation(){
		return new ObjectPropertyOperation(this.tree, this.valueVisitor.getOperation());
	}

	Expression(node, useVisitor){
		if(node === this.tree.value){
			var visitor = new ExpressionVisitor(this.scope, this.referencer);
			this.valueVisitor = visitor;
			return useVisitor(visitor);
		}
	}

}

class AssignmentExpressionVisitor{
	constructor(tree, scope, referencer) {
		this.tree = tree;
		this.scope = scope;
		this.referencer = referencer;
		this.assignmentVisitor = undefined;
		this.valueVisitor = undefined;
	}

	getOperation(){
		return new ValueAssignmentOperation(this.tree, this.valueVisitor.getOperation(), this.assignmentVisitor.getOperation());
	}

	Identifier(node, useVisitor){
		if(node === this.tree.left){
			var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
			this.assignmentVisitor = visitor;
			return useVisitor(visitor);
		}
		var visitor = new ExpressionVisitor(this.scope, this.referencer);
		this.valueVisitor = visitor;
		return useVisitor(visitor);
	}

	MemberExpression(node, useVisitor){
		if(node === this.tree.left){
			var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
			this.assignmentVisitor = visitor;
			return useVisitor(visitor);
		}
		var visitor = new ExpressionVisitor(this.scope, this.referencer);
		this.valueVisitor = visitor;
		return useVisitor(visitor);
	}

	Pattern(node, useVisitor){
		if(node === this.tree.left){
			var visitor = new AssignmentTargetPatternVisitor(this.scope, this.referencer);
			this.assignmentVisitor = visitor;
			return useVisitor(visitor);
		}
	}

	Expression(node, useVisitor){
		var visitor = new ExpressionVisitor(this.scope, this.referencer);
		this.valueVisitor = visitor;
		return useVisitor(visitor);
	}
}

class ExpressionStatementVisitor{
	constructor(tree, scope, referencer) {
		this.tree = tree;
		this.scope = scope;
		this.referencer = referencer;
		this.visitor = undefined;
	}

	getOperation(){
		return new ExpressionOperation(this.tree, this.visitor.getOperation());
	}

	Expression(node, useVisitor){
		var visitor = new ExpressionVisitor(this.scope, this.referencer);
		this.visitor = visitor;
		return useVisitor(visitor);
	}
}

class BlockVisitor{
	constructor(scope, tree){
		this.tree = tree;
		this.scope = scope;
		this.visitors = [];
	}

	getOperation(){
		return new BlockOperation(this.tree, this.visitors.map(v => v.getOperation()));
	}

	ExpressionStatement(node){
		var visitor = new ExpressionStatementVisitor(node, this.scope, new SymbolReferencer(this.scope));
		this.visitors.push(visitor);
		return visitor;
	}

	VariableDeclaration(node){
		var visitor = new VariableDeclarationVisitor(this.scope, new DeclaringSymbolReferencer(this.scope, node.kind), new SymbolReferencer(this.scope), node);
		this.visitors.push(visitor);
		return visitor;
	}
	FunctionDeclaration(node){
		var visitor = new FunctionDeclarationVisitor(node, this.scope, new DeclaringSymbolReferencer(this.scope, 'var'));
		this.visitors.push(visitor);
		return visitor;
	}
}

class ProgramTreeVisitor extends BlockVisitor{

	getOperation(){
		return new Program(this.tree, this.visitors.map(v => v.getOperation()));
	}


	ModuleDeclaration(node){

	}
}

export function createProgram(tree){
	var globalScope = new BlockScope();
	var visitor = new ProgramTreeVisitor(globalScope, tree);
	visit(tree, visitor);
	var program = visitor.getOperation();//new Program(tree, visitor.operations);
	return program;
}
