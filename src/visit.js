import {InterfaceCollection} from './interface-collection';
import estreeInterfaces from './estree-interfaces';

var collection = new InterfaceCollection();

for(var _interface of estreeInterfaces){
	collection.addInterface(_interface);
}

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