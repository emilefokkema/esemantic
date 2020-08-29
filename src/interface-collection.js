var distinct = function(arr){
	return arr.filter(function(x, i){return arr.indexOf(x) === i;});
}
var mapMany = function(arr, mapFn){
	return arr.map(mapFn).reduce(function(a, b){return a.concat(b);}, []);
}

class Interface{
	constructor(name, test, getChildrenFn, parentInterfaces){
		this.allParents = distinct(mapMany(parentInterfaces, function(p){return p.getSelfAndParents();}));
		this.name = name;
		this.getChildrenFn = getChildrenFn;
		this.parentInterfaces = parentInterfaces;
		this.test = test;
	}
	isAssignableFromNode(n){
		for(var parent of this.allParents){
			if(!parent.isAssignableFromNode(n)){
				return false;
			}
		}
		if(!this.test){
			return true;
		}
		return this.test(n);
	}
	getSelfAndParents(){
		return [this].concat(this.allParents);
	}
	isMoreSpecificThan(t){
		return this.hasParent(t) || (this.test && !t.test);
	}
	getChildren(n){
		var selfAndParents = this.getSelfAndParents();

		return distinct(mapMany(selfAndParents, function(t){return t.getChildrenFn(n.node);}));
	}
	descendsFrom(typeName){
		return this.getSelfAndParents().findIndex(function(t){return t.name === typeName;}) > -1;
	}
	hasParent(t){
		for(var parent of this.parentInterfaces){
			if(parent === t || parent.hasParent(t)){
				return true;
			}
		}
		return false;
	}
}

export class InterfaceCollection{
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
	addInterface(d){
		var name = d.typeName ? d.typeName : d.name;
		if(this.interfaces.findIndex(function(i){return i.name === name;}) > -1){
			throw new Error(`interface '${name}' is already defined`)
		}
		var getChildren = d.children ? (n) => [...d.children(n)].filter(n => !!n) : () => [];
		var test = d.typeName ? (n) => n.type === d.typeName : d.test;
		var parentInterfaces = d.extends ? this.getInterfaces(d.extends) : [];
		this.interfaces.push(new Interface(name, test, getChildren, parentInterfaces));
	}
	getMostSpecificTypes(types){
		return types.filter(function(t){return types.findIndex(function(tt){return tt.isMoreSpecificThan(t);}) === -1;});
	}
	getNodeType(node){
		var types = this.interfaces.filter(function(i){return i.isAssignableFromNode(node);});
		if(!types.length){
			throw new Error(`${JSON.stringify(node.type)} is not a known type`)
		}
		var mostSpecific = this.getMostSpecificTypes(types);//types.filter(function(t){return types.findIndex(function(tt){return tt.isMoreSpecificThan(t);}) === -1;});
		if(mostSpecific.length > 1){
			throw new Error(`For node of type ${node.type}, cannot decide to which of ${mostSpecific.map(function(t){return t.name}).join(', ')} to assign`);
		}
		return mostSpecific[0];
	}
	getChildren(node){
		return this.getNodeType(node).getChildren(node);
	}
	findVisitorMethod(nodeTypeName, allTypes, visitor){
		var nodeTypesForWhichThereIsAMethod = allTypes.filter(t => !!visitor[t.name]);
		var mostSpecific = this.getMostSpecificTypes(nodeTypesForWhichThereIsAMethod);
		if(mostSpecific.length > 1){
			throw new Error(`For node of type ${nodeTypeName}, cannot decide between methods ${mostSpecific.map(t => `'${t.name}'`).join(' and ')}`);
		}
		if(mostSpecific.length === 0){
			return undefined;
		}
		return visitor[mostSpecific[0].name];
	}
	getNewVisitor(node, visitor, registerNewVisitorDone){
		var nodeTypes = this.getNodeType(node).getSelfAndParents();
		return this.getNewVisitorFromNodeAndTypesAndVisitor(node, nodeTypes, visitor, registerNewVisitorDone);
	}
	getNewVisitorFromNodeAndTypesAndVisitor(node, nodeTypes, visitor, registerNewVisitorDone){
		var visitorMethod = this.findVisitorMethod(node.type, nodeTypes, visitor);
		if(!visitorMethod){
			return visitor;
		}
		return visitorMethod.apply(visitor, [node.node, (replacingVisitor) => this.getNewVisitorFromNodeAndTypesAndVisitor(node, nodeTypes, replacingVisitor, registerNewVisitorDone), registerNewVisitorDone]);
	}
}