import {visit} from './visit';
import {
	ObjectDestructuringAssignmentOperation,
	ArrayDestructuringAssignmentOperation,
	PropertyDestructuringAssignmentOperation,
	DefaultAssignmentOperation,
	RestElementAssignmentOperation,
	SymbolAssignmentOperation,
	SymbolReferenceOperation,
	ParameterAssignmentOperation,
	VariableDeclaratorOperation,
	VariableDeclarationOperation,
	FunctionDeclarationOperation,
	BlockOperation,
	Program} from './operations'

class Symbol{
	constructor(identifier, kind) {
		this.name = identifier.name;
		this.declaration = identifier;
		this.kind = kind;
	}
}

var scopeId = 0;
class BlockScope{
	constructor(){
		this.scopeId = scopeId++;
	}
	addSymbol(id, kind){
		return new Symbol(id, kind);
		//console.log(`scope with id ${this.scopeId} creating symbol for `, id);
	}
	createFunctionScope(){
		return new BlockScope();
	}
}

class VariableDeclarationVisitor{
	constructor(createSymbolAssignmentOperation, tree){
		this.tree = tree;
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.declaratorVisitors = [];
	}
	getOperation(){
		return new VariableDeclarationOperation(this.tree, this.declaratorVisitors.map(v => v.getOperation()));
	}
	VariableDeclarator(node){
		var visitor = new VariableDeclaratorVisitor(this.createSymbolAssignmentOperation, node);
		this.declaratorVisitors.push(visitor);
		return visitor;
	}
}

class VariableDeclaratorVisitor{
	constructor(createSymbolAssignmentOperation, tree){
		this.tree = tree;
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.idVisitor = undefined;
	}

	getOperation(){
		return new VariableDeclaratorOperation(this.tree, this.idVisitor.getOperation());
	}

	Pattern(node, useVisitor){
		if(node === this.tree.id){
			var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
			this.idVisitor = visitor;
			return useVisitor(visitor);
		}
	}
}

class AssignmentTargetPatternVisitor{
	constructor(createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.operationFn = undefined;
	}
	getOperation(){
		return this.operationFn();
	}
	Identifier(node){
		this.operationFn = () => this.createSymbolAssignmentOperation(node);
	}
	RestElement(node){
		var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
		this.operationFn = () => {
			return new RestElementAssignmentOperation(node, visitor.getOperation());
		};
		return visitor;
	}
	ObjectPattern(node){
		var visitor = new ObjectPatternVisitor(this.createSymbolAssignmentOperation, node);
		this.operationFn = () => {
			return visitor.getOperation();
		};
		return visitor;
	}
	ArrayPattern(node){
		var visitor = new ArrayPatternVisitor(this.createSymbolAssignmentOperation, node);
		this.operationFn = () => {
			return visitor.getOperation();
		};
		return visitor;
	}
	AssignmentPattern(node){
		var visitor = new AssignmentPatternVisitor(this.createSymbolAssignmentOperation, node);
		this.operationFn = () => {
			return visitor.getOperation();
		};
		return visitor;
	}
}

class AssignmentPatternVisitor{
	constructor(createSymbolAssignmentOperation, tree){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.tree = tree;
		this.leftVisitor = undefined;
	}

	getOperation(){
		return new DefaultAssignmentOperation(this.tree, this.leftVisitor.getOperation());
	}

	Expression(node, useVisitor){
		if(node === this.tree.left){
			var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
			this.leftVisitor = visitor;
			return useVisitor(visitor);
		}
	}
}

class PropertyAssignmentVisitor{
	constructor(createSymbolAssignmentOperation, tree){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.tree = tree;
		this.valueVisitor = undefined;
	}

	getOperation(){
		return new PropertyDestructuringAssignmentOperation(this.tree, this.valueVisitor.getOperation())
	}

	Pattern(node, useVisitor){
		if(node === this.tree.key){
			return;
		}
		var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
		this.valueVisitor = visitor;
		return useVisitor(visitor);
	}
}

class ObjectPatternVisitor{
	constructor(createSymbolAssignmentOperation, tree){
		this.tree = tree;
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.propertyVisitors = [];
	}

	getOperation(){
		return new ObjectDestructuringAssignmentOperation(this.tree, this.propertyVisitors.map(v => v.getOperation()))
	}

	Property(node){
		var visitor = new PropertyAssignmentVisitor(this.createSymbolAssignmentOperation, node);
		this.propertyVisitors.push(visitor);
		return visitor;
	}
}

class ArrayPatternVisitor{
	constructor(createSymbolAssignmentOperation, tree){
		this.tree = tree;
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.assignmentVisitors = [];
	}

	getOperation(){
		return new ArrayDestructuringAssignmentOperation(this.tree, this.assignmentVisitors.map(v => v.getOperation()));
	}

	Pattern(node, useVisitor){
		var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
		this.assignmentVisitors.push(visitor);
		return useVisitor(visitor);
	}
}

class FunctionDeclarationVisitor{
	constructor(tree, scope){
		this.tree = tree;
		this.scope = scope;
		this.functionScope = scope.createFunctionScope();
		this.parameterFns = [];
		this.blockVisitor = undefined;
		this.assignment = undefined;
	}

	getOperation(){
		return new FunctionDeclarationOperation(this.tree, this.assignment, this.parameterFns.map(fn => fn()), this.blockVisitor.getOperation());
	}

	FunctionBody(node){
		var visitor = new BlockVisitor(this.functionScope, node);
		this.blockVisitor = visitor;
		return visitor;
	}

	Pattern(node, useVisitor){
		if(node === this.tree.id){
			var symbol = this.scope.addSymbol(node, 'var');
			var symbolReference = new SymbolReferenceOperation(node, symbol);
			this.assignment = new SymbolAssignmentOperation(node, symbolReference);
		}else{
			var visitor = new AssignmentTargetPatternVisitor((id) => {
				var symbol = this.functionScope.addSymbol(id, 'var');
				var symbolReference = new SymbolReferenceOperation(id, symbol);
				return new SymbolAssignmentOperation(id, symbolReference)
			});
			this.parameterFns.push(() => new ParameterAssignmentOperation(node, visitor.getOperation()));
			return useVisitor(visitor);
		}
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

	VariableDeclaration(node){
		var visitor = new VariableDeclarationVisitor((id) => {
			var symbol = this.scope.addSymbol(id, node.kind);//new Symbol(id, node.kind);
			var symbolReference = new SymbolReferenceOperation(id, symbol);
			return new SymbolAssignmentOperation(id, symbolReference)
		}, node);
		this.visitors.push(visitor);
		return visitor;
	}
	FunctionDeclaration(node){
		var visitor = new FunctionDeclarationVisitor(node, this.scope);
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
