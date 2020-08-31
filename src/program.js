import {visit} from './visit';
import {
	ObjectDestructuringAssignmentOperation,
	ArrayDestructuringAssignmentOperation,
	PropertyDestructuringAssignmentOperation,
	DefaultAssignmentOperation,
	RestElementAssignmentOperation,
	SymbolAssignmentOperation,
	ParameterAssignmentOperation,
	VariableDeclaratorOperation,
	VariableDeclarationOperation,
	FunctionDeclarationOperation,
	BlockOperation} from './operations'

var scopeId = 0;
class BlockScope{
	constructor(){
		this.scopeId = scopeId++;
	}
	createSymbol(id){
		//console.log(`scope with id ${this.scopeId} creating symbol for `, id);
	}
	// addVariableDeclarator(id, variableDeclaratorOperation){
	// 	//console.log(`scope with id ${this.scopeId} adding variable declarator named ${id.name} `, variableDeclaratorOperation)
	// }
	// addFunctionDeclaration(id, functionDeclarationOperation){
	// 	//console.log(`scope with id ${this.scopeId} adding function declaration named ${id.name} `, functionDeclarationOperation)
	// }
	// addParameterDeclaration(id, parameterDeclarationOperation){
	// 	//console.log(`scope with id ${this.scopeId} adding parameter declaration named ${id.name} `, parameterDeclarationOperation)
	// }
	createFunctionScope(){
		return new BlockScope();
	}
}

class VariableDeclarationVisitor{
	constructor(scope){
		this.scope = scope;
		this.declaratorOperations = [];
	}
	VariableDeclarator(node, _, onDone){
		var visitor = new VariableDeclaratorVisitor(node.id);
		onDone(() => {
			this.declaratorOperations.push(new VariableDeclaratorOperation(node, visitor.assignmentOperation));
		});
		return visitor;
	}
}

class VariableDeclaratorVisitor{
	constructor(id){
		this.id = id;
		this.assignmentOperation = undefined;
	}
	Pattern(node, useVisitor, onDone){
		if(node === this.id){
			var visitor = new AssignmentTargetPatternVisitor();
			onDone(() => {
				this.assignmentOperation = visitor.operation;
			});
			return useVisitor(visitor);
		}
	}
}

class AssignmentTargetPatternVisitor{
	constructor(){
		this.operation = undefined;
		this.symbolAssignments = [];
	}
	Identifier(node){
		this.operation = new SymbolAssignmentOperation(node);
		this.symbolAssignments = [this.operation];
	}
	RestElement(node, _, onDone){
		var visitor = new AssignmentTargetPatternVisitor();
		onDone(() => {
			this.operation = new RestElementAssignmentOperation(node, visitor.operation);
			this.symbolAssignments = visitor.symbolAssignments;
		});
		return visitor;
	}
	ObjectPattern(node, _, onDone){
		var visitor = new ObjectPatternVisitor();
		onDone(() => {
			this.operation = new ObjectDestructuringAssignmentOperation(node, visitor.propertyAssignments);
			this.symbolAssignments = visitor.symbolAssignments;
		});
		return visitor;
	}
	ArrayPattern(node, _, onDone){
		var visitor = new ArrayPatternVisitor();
		onDone(() => {
			this.operation = new ArrayDestructuringAssignmentOperation(node, visitor.assignmentOperations);
			this.symbolAssignments = visitor.symbolAssignments;
		});
		return visitor;
	}
	AssignmentPattern(node, _, onDone){
		var visitor = new AssignmentPatternVisitor(node.left);
		onDone(() => {
			this.operation = new DefaultAssignmentOperation(node, visitor.assignmentOperation);
			this.symbolAssignments = visitor.symbolAssignments;
		});
		return visitor;
	}
}

class AssignmentPatternVisitor{
	constructor(left){
		this.left = left;
		this.symbolAssignments = [];
		this.assignmentOperation = undefined;
	}
	Expression(node, useVisitor, onDone){
		if(node === this.left){
			var visitor = new AssignmentTargetPatternVisitor(this.defaultAssignmentOperation, this.sourceScope, this.targetScope);
			onDone(() => {
				this.assignmentOperation = visitor.operation;
				this.symbolAssignments = visitor.symbolAssignments;
			});
			return useVisitor(visitor);
		}
	}
}

class PropertyAssignmentVisitor{
	constructor(key){
		this.key = key;
		this.operation = undefined;
		this.symbolAssignments = [];
	}
	Pattern(node, useVisitor, onDone){
		if(node === this.key){
			return;
		}
		var visitor = new AssignmentTargetPatternVisitor();
		onDone(() => {
			this.symbolAssignments = visitor.symbolAssignments;
			this.operation = visitor.operation;
		});
		return useVisitor(visitor);
	}
}

class ObjectPatternVisitor{
	constructor(){
		this.symbolAssignments = [];
		this.propertyAssignments = [];
	}
	Property(node, _, onDone){
		var visitor = new PropertyAssignmentVisitor(node.key);
		onDone(() => {
			this.symbolAssignments.push(...visitor.symbolAssignments);
			this.propertyAssignments.push(new PropertyDestructuringAssignmentOperation(node, visitor.operation));
		});
		return visitor;
	}
}

class ArrayPatternVisitor{
	constructor(){
		this.assignmentOperations = [];
		this.symbolAssignments = [];
	}
	Pattern(node, useVisitor, onDone){
		var visitor = new AssignmentTargetPatternVisitor();
		onDone(() => {
			this.symbolAssignments.push(...visitor.symbolAssignments);
			this.assignmentOperations.push(visitor.operation);
		});
		return useVisitor(visitor);
	}
}

class FunctionDeclarationVisitor{
	constructor(scope, id){
		this.id = id;
		this.scope = scope;
		this.functionScope = this.scope.createFunctionScope();
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
			this.scope.createSymbol(node);
		}else{
			var visitor = new AssignmentTargetPatternVisitor();
			onDone(() => {
				this.parameterAssignments.push(new ParameterAssignmentOperation(node, visitor.operation));
			});
			return useVisitor(visitor);
		}
	}
}

class BlockVisitor{
	constructor(scope){
		this.scope = scope;
		this.operations = [];
	}
	VariableDeclaration(node, _, onDone){
		var visitor = new VariableDeclarationVisitor(this.scope);
		onDone(() => {
			this.operations.push(new VariableDeclarationOperation(node, visitor.declaratorOperations));
		});
		return visitor;
	}
	FunctionDeclaration(node, _, onDone){
		var visitor = new FunctionDeclarationVisitor(this.scope, node.id);
		onDone(() => {
			this.operations.push(new FunctionDeclarationOperation(node, visitor.parameterAssignments, visitor.blockOperation));
		});
		return visitor;
	}
}

class ProgramTreeVisitor extends BlockVisitor{
	ModuleDeclaration(node){

	}
}

export class Program extends BlockOperation{
	constructor(tree, operations) {
		super(tree, operations);
		this.kind = "Program";
	}


	static create(tree){
		var globalScope = new BlockScope();
		var visitor = new ProgramTreeVisitor(globalScope);
		visit(tree, visitor);
		var program = new Program(tree, visitor.operations);
		return program;
	}
}
