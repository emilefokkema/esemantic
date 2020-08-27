import {visit} from './visit';

var scopeId = 0;
class BlockScope{
	constructor(){
		this.scopeId = scopeId++;
	}
	addVariableDeclarator(id, variableDeclaratorOperation){
		//console.log(`scope with id ${this.scopeId} adding variable declarator named ${id.name} `, variableDeclaratorOperation)
	}
	addFunctionDeclaration(id, functionDeclarationOperation){
		//console.log(`scope with id ${this.scopeId} adding function declaration named ${id.name} `, functionDeclarationOperation)
	}
	addParameterDeclaration(id, parameterDeclarationOperation){
		//console.log(`scope with id ${this.scopeId} adding parameter declaration named ${id.name} `, parameterDeclarationOperation)
	}
	createFunctionScope(){
		return new BlockScope();
	}
}

class Operation{
	constructor(tree){
		this.tree = tree;
		this.childOperations = [];
	}
	*getSelfAndChildren(){
		yield this;
		for(var childOperation of this.childOperations){
			yield* childOperation.getSelfAndChildren();
		}
	}
}

class VariableDeclaratorOperation extends Operation{
	constructor(tree){
		super(tree);
		this.id = tree.id;
	}
}

class VariableDeclarationOperation extends Operation{
	constructor(tree){
		super(tree);
		this.declarationKind = tree.kind;
	}
	addVariableDeclarator(tree){
		var declarator = new VariableDeclaratorOperation(tree);
		this.childOperations.push(declarator);
		return declarator;
	}
}

class ParameterDeclarationOperation extends Operation{

}

class FunctionDeclarationOperation extends Operation{
	constructor(tree){
		super(tree);
		this.id = tree.id;
	}
	addFunctionBody(tree){
		var body = new BlockOperation(tree);
		this.childOperations.push(body);
		return body;
	}
	addParameterDeclaration(tree){
		var parameterDeclaration = new ParameterDeclarationOperation(tree);
		this.childOperations.push(parameterDeclaration);
		return parameterDeclaration;
	}
}

class BlockOperation extends Operation{

	addVariableDeclaration(tree){
		var declaration = new VariableDeclarationOperation(tree);
		this.childOperations.push(declaration);
		return declaration;
	}

	addFunctionDeclaration(tree){
		var declaration = new FunctionDeclarationOperation(tree);
		this.childOperations.push(declaration);
		return declaration;
	}
}

class VariableDeclarationVisitor{
	constructor(scope, variableDeclarationOperation){
		this.scope = scope;
		this.variableDeclarationOperation = variableDeclarationOperation;
	}
	VariableDeclarator(node){
		var declarator = this.variableDeclarationOperation.addVariableDeclarator(node);
		return new VariableDeclaratorVisitor(this.scope, declarator, this.variableDeclarationOperation.declarationKind);
	}
}

class VariableDeclaratorVisitor{
	constructor(scope, variableDeclaratorOperation, declarationKind){
		this.scope = scope;
		this.variableDeclaratorOperation = variableDeclaratorOperation;
		this.declarationKind = declarationKind;
	}
	Pattern(node, useVisitor){
		if(node === this.variableDeclaratorOperation.id){
			return useVisitor(new AssignmentTargetPatternVisitor((name) => {
				this.scope.addVariableDeclarator(name, this.variableDeclaratorOperation);
			}));
		}
	}
}

class AssignmentTargetPatternVisitor{
	constructor(onFoundName){
		this.onFoundName = onFoundName;
	}
	Identifier(node){
		this.onFoundName(node);
	}
	RestElement(){
		return this;
	}
	ObjectPattern(){
		return new AssignmentTargetObjectPatternVisitor(this.onFoundName);
	}
}

class AssignmentTargetObjectPatternVisitor{
	constructor(onFoundName){
		this.onFoundName = onFoundName;
	}
	AssignmentProperty(node){
		//console.log(`encountered assignment property `, node);
	}
}

class FunctionDeclarationVisitor{
	constructor(scope, functionDeclarationOperation){
		this.scope = scope;
		this.functionDeclarationOperation = functionDeclarationOperation;
		this.functionScope = this.scope.createFunctionScope();
	}

	FunctionBody(node){
		var functionBody = this.functionDeclarationOperation.addFunctionBody(node);
		return new BlockVisitor(this.functionScope, functionBody);
	}

	Pattern(node, useVisitor){
		if(node === this.functionDeclarationOperation.id){
			this.scope.addFunctionDeclaration(node, this.functionDeclarationOperation);
		}else{
			var parameterDeclaration = this.functionDeclarationOperation.addParameterDeclaration(node);
			return useVisitor(new AssignmentTargetPatternVisitor((name) => {
				this.functionScope.addParameterDeclaration(name, parameterDeclaration);
			}));
		}
	}
}

class BlockVisitor{
	constructor(scope, blockOperation){
		this.scope = scope;
		this.blockOperation = blockOperation;
	}
	VariableDeclaration(node){
		var declaration = this.blockOperation.addVariableDeclaration(node);
		return new VariableDeclarationVisitor(this.scope, declaration);
	}
	FunctionDeclaration(node){
		var declaration = this.blockOperation.addFunctionDeclaration(node);
		return new FunctionDeclarationVisitor(this.scope, declaration);
	}
}

class ProgramTreeVisitor extends BlockVisitor{
	ModuleDeclaration(node){

	}
}

export class Program extends BlockOperation{
	getOperation(tree){
		for(var operation of this.getSelfAndChildren()){
			if(operation.tree === tree){
				return operation;
			}
		}
	}

	static create(tree){
		var globalScope = new BlockScope();
		var program = new Program(tree);
		var visitor = new ProgramTreeVisitor(globalScope, program);
		visit(tree, visitor);
		return program;
	}
}