export class Operation{
	constructor(tree){
		this.tree = tree;
		this.childOperations = [];
	}
	getOperation(tree){
		for(var childOperation of this.childOperations){
			var childResult = childOperation.getOperation(tree);
			if(childResult){
				return childResult;
			}
		}
		if(tree === this.tree){
			return this;
		}
		return undefined;
	}
};

export class ObjectDestructuringAssignmentOperation extends Operation{
	constructor(tree, propertyAssignments){
		super(tree);
		this.childOperations = propertyAssignments;
	}
}

export class ArrayDestructuringAssignmentOperation extends Operation{
	constructor(tree, assignmentOperations){
		super(tree);
		this.childOperations = assignmentOperations;
	}
}

export class PropertyDestructuringAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.key = tree.key;
		this.childOperations.push(assignmentOperation);
	}
}

export class DefaultAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.left = tree.left;
		this.childOperations.push(assignmentOperation);
	}
}

export class RestElementAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.childOperations.push(assignmentOperation);
	}
}

export class SymbolAssignmentOperation extends Operation{

}

export class ParameterAssignmentOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.childOperations.push(assignmentOperation);
	}
}

export class VariableDeclaratorOperation extends Operation{
	constructor(tree, assignmentOperation){
		super(tree);
		this.id = tree.id;
		this.childOperations.push(assignmentOperation);
	}
}

export class VariableDeclarationOperation extends Operation{
	constructor(tree, declaratorOperations){
		super(tree);
		this.childOperations = declaratorOperations;
	}
}

export class FunctionDeclarationOperation extends Operation{
	constructor(tree, parameterAssignments, blockOperation){
		super(tree);
		this.childOperations.push(...parameterAssignments);
		this.childOperations.push(blockOperation);
	}
}

export class BlockOperation extends Operation{
	constructor(tree, operations){
		super(tree);
		this.childOperations = operations;
	}
}