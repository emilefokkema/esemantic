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
	constructor(createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.declaratorOperations = [];
	}
	VariableDeclarator(node, _, onDone){
		var visitor = new VariableDeclaratorVisitor(node.id, this.createSymbolAssignmentOperation);
		onDone(() => {
			this.declaratorOperations.push(new VariableDeclaratorOperation(node, visitor.assignmentOperation));
		});
		return visitor;
	}
}

class VariableDeclaratorVisitor{
	constructor(id, createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.id = id;
		this.assignmentOperation = undefined;
	}
	Pattern(node, useVisitor, onDone){
		if(node === this.id){
			var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
			onDone(() => {
				this.assignmentOperation = visitor.operation;
			});
			return useVisitor(visitor);
		}
	}
}

class AssignmentTargetPatternVisitor{
	constructor(createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.operation = undefined;
	}
	Identifier(node){
		this.operation = this.createSymbolAssignmentOperation(node);
	}
	RestElement(node, _, onDone){
		var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
		onDone(() => {
			this.operation = new RestElementAssignmentOperation(node, visitor.operation);
		});
		return visitor;
	}
	ObjectPattern(node, _, onDone){
		var visitor = new ObjectPatternVisitor(this.createSymbolAssignmentOperation);
		onDone(() => {
			this.operation = new ObjectDestructuringAssignmentOperation(node, visitor.propertyAssignments);
		});
		return visitor;
	}
	ArrayPattern(node, _, onDone){
		var visitor = new ArrayPatternVisitor(this.createSymbolAssignmentOperation);
		onDone(() => {
			this.operation = new ArrayDestructuringAssignmentOperation(node, visitor.assignmentOperations);
		});
		return visitor;
	}
	AssignmentPattern(node, _, onDone){
		var visitor = new AssignmentPatternVisitor(node.left, this.createSymbolAssignmentOperation);
		onDone(() => {
			this.operation = new DefaultAssignmentOperation(node, visitor.assignmentOperation);
		});
		return visitor;
	}
}

class AssignmentPatternVisitor{
	constructor(left, createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.left = left;
		this.assignmentOperation = undefined;
	}
	Expression(node, useVisitor, onDone){
		if(node === this.left){
			var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
			onDone(() => {
				this.assignmentOperation = visitor.operation;
			});
			return useVisitor(visitor);
		}
	}
}

class PropertyAssignmentVisitor{
	constructor(key, createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.key = key;
		this.operation = undefined;
	}
	Pattern(node, useVisitor, onDone){
		if(node === this.key){
			return;
		}
		var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
		onDone(() => {
			this.operation = visitor.operation;
		});
		return useVisitor(visitor);
	}
}

class ObjectPatternVisitor{
	constructor(createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.propertyAssignments = [];
	}
	Property(node, _, onDone){
		var visitor = new PropertyAssignmentVisitor(node.key, this.createSymbolAssignmentOperation);
		onDone(() => {
			this.propertyAssignments.push(new PropertyDestructuringAssignmentOperation(node, visitor.operation));
		});
		return visitor;
	}
}

class ArrayPatternVisitor{
	constructor(createSymbolAssignmentOperation){
		this.createSymbolAssignmentOperation = createSymbolAssignmentOperation;
		this.assignmentOperations = [];
	}
	Pattern(node, useVisitor, onDone){
		var visitor = new AssignmentTargetPatternVisitor(this.createSymbolAssignmentOperation);
		onDone(() => {
			this.assignmentOperations.push(visitor.operation);
		});
		return useVisitor(visitor);
	}
}

class FunctionDeclarationVisitor{
	constructor(functionScope, id){
		this.id = id;
		this.functionScope = functionScope;
		this.parameterAssignments = [];
		this.blockOperation = undefined;
	}

	FunctionBody(node, _, onDone){
		var visitor = new BlockVisitor(this.functionScope);
		onDone(() => {
			this.blockOperation = new BlockOperation(node, visitor.operations);
		});
		return visitor;
	}

	Pattern(node, useVisitor, onDone){
		if(node === this.id){
			return;
		}
		var visitor = new AssignmentTargetPatternVisitor((id) => {
			var symbol = this.functionScope.addSymbol(id, 'var');
			var symbolReference = new SymbolReferenceOperation(id, symbol);
			return new SymbolAssignmentOperation(id, symbolReference)
		});
		onDone(() => {
			this.parameterAssignments.push(new ParameterAssignmentOperation(node, visitor.operation));
		});
		return useVisitor(visitor);
	}
}

class BlockVisitor{
	constructor(scope){
		this.scope = scope;
		this.operations = [];
	}

	VariableDeclaration(node, _, onDone){
		var visitor = new VariableDeclarationVisitor((id) => {
			var symbol = this.scope.addSymbol(id, node.kind);//new Symbol(id, node.kind);
			var symbolReference = new SymbolReferenceOperation(id, symbol);
			return new SymbolAssignmentOperation(id, symbolReference)
		});
		onDone(() => {
			this.operations.push(new VariableDeclarationOperation(node, visitor.declaratorOperations));
		});
		return visitor;
	}
	FunctionDeclaration(node, _, onDone){
		var visitor = new FunctionDeclarationVisitor(this.scope.createFunctionScope(), node.id);
		var symbol = this.scope.addSymbol(node.id, 'var');
		var symbolReference = new SymbolReferenceOperation(node.id, symbol);
		var assignment = new SymbolAssignmentOperation(node.id, symbolReference);
		onDone(() => {
			this.operations.push(new FunctionDeclarationOperation(node, assignment, visitor.parameterAssignments, visitor.blockOperation));
		});
		return visitor;
	}
}

class ProgramTreeVisitor extends BlockVisitor{
	ModuleDeclaration(node){

	}
}

export function createProgram(tree){
	var globalScope = new BlockScope();
	var visitor = new ProgramTreeVisitor(globalScope);
	visit(tree, visitor);
	var program = new Program(tree, visitor.operations);
	return program;
}
