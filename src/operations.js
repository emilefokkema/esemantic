export class Operation{
	constructor(tree){
		this.tree = tree;
	}
};

export class ObjectDestructuringAssignmentOperation extends Operation{
	constructor(tree, propertyAssignments){
		super(tree);
		this.properties = propertyAssignments;
		this.kind = "ObjectDestructuringAssignment";
	}
}

export class ArrayDestructuringAssignmentOperation extends Operation{
	constructor(tree, assignmentOperations){
		super(tree);
		this.elements = assignmentOperations;
		this.kind = "ArrayDestructuringAssignment";
	}
}

export class PropertyDestructuringAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.valueAssignment = assignmentOperation;
		this.kind = "PropertyDestructuringAssignment";
	}
}

export class DefaultAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation, defaultValue){
		super(tree);
		this.assignment = assignmentOperation;
		this.defaultValue = defaultValue;
		this.kind = "DefaultAssignment";
	}
}

export class RestElementAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.assignment = assignmentOperation;
		this.kind = "RestElementAssignment";
	}
}

export class KeyComputationOperation extends Operation{
	constructor(tree, expression){
		super(tree);
		this.expression = expression;
		this.kind = "KeyComputation";
	}
}

export class StaticKeyOperation extends Operation{
	constructor(tree, keyName){
		super(tree);
		this.keyName = keyName;
		this.kind = "StaticKey";
	}
}

export class MemberReferenceOperation extends Operation{
	constructor(tree, object, property){
		super(tree);
		this.object = object;
		this.property = property;
		this.kind = "MemberReference";
	}
}

export class SymbolReferenceOperation extends Operation{
	constructor(tree, symbol) {
		super(tree);
		this.symbol = symbol;
		this.kind = "SymbolReference";
	}
}

export class ValueAssignmentOperation extends Operation{
	constructor(tree, value, assignment){
		super(tree);
		this.value = value;
		this.assignment = assignment;
		this.kind = "ValueAssignment";
	}
}

export class LiteralOperation extends Operation{
	constructor(tree) {
		super(tree);
		this.constantValue = tree.value;
		this.kind = "Literal";
	}
}

export class ReferenceAssignmentOperation extends Operation{
	constructor(tree, reference) {
		super(tree);
		this.reference = reference;
		this.kind = "ReferenceAssignment";
	}
}

export class ExpressionOperation extends Operation{
	constructor(tree, operation) {
		super(tree);
		this.operation = operation;
		this.kind = "Expression";
	}
}

export class ParameterAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.assignment = assignmentOperation;
		this.kind = "ParameterAssignment";
	}
}

export class VariableDeclaratorOperation extends Operation{
	constructor(tree, assignmentOperation, init){
		super(tree);
		this.assignment = assignmentOperation;
		this.init = init;
		this.kind = "VariableDeclarator";
	}
}

export class ObjectOperation extends Operation{
	constructor(tree, properties) {
		super(tree);
		this.properties = properties;
		this.kind = "Object";
	}
}

export class ObjectPropertyOperation extends Operation{
	constructor(tree, value) {
		super(tree);
		this.value = value;
		this.kind = "ObjectProperty"
	}
}

export class VariableDeclarationOperation extends Operation{
	constructor(tree, declaratorOperations){
		super(tree);
		this.declarators = declaratorOperations;
		this.kind = "VariableDeclaration";
	}
}

export class FunctionDeclarationOperation extends Operation{
	constructor(tree, assignment, parameterAssignments, blockOperation){
		super(tree);
		this.assignment = assignment;
		this.params = parameterAssignments;
		this.body = blockOperation;
		this.kind = "FunctionDeclaration";
	}
}

export class BlockOperation extends Operation{
	constructor(tree, operations){
		super(tree);
		this.operations = operations;
		this.kind = "Block";
	}
}

export class Program extends BlockOperation{
	constructor(tree, operations) {
		super(tree, operations);
		this.kind = "Program";
	}
}
