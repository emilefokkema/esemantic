import {visit} from '../src/visit';
import visitorCases from './visitor-cases';

function createVisitorMethod(){
	var actualNodeTypes = [];
	return {
		actualNodeTypes: actualNodeTypes,
		callWithNode: function(n){
			actualNodeTypes.push(n.type);
		}
	};
}

function addMethodToVisitor(visitor, method){
	var visitorMethod = createVisitorMethod();
	visitor[method.methodName] = function(node){
		visitorMethod.callWithNode(node);
		return visitor;
	};
	return visitorMethod;
}

function createVisitorThatHasMethods(methods){
	var visitor = {};
	var methodsToVerify = {};
	for(let method of methods){
		methodsToVerify[method.methodName] = addMethodToVisitor(visitor, method);
	}
	return {
		visitor: visitor,
		methodsToVerify: methodsToVerify
	};
}

describe.each(visitorCases.map(c => [c.script, c.tree, c.visitorCases]))('when visiting', (script, tree, cases) => {
	
	describe(`the tree for script '${script}'`, () => {

		describe.each(cases.map(c => [c.methods, c.expectException]))('with a visitor', (methods, expectException) => {

			describe(`that has methods ${methods.map(m => `'${m.methodName}'`).join(', ')}`, () => {
				var visitor;
				var caughtException;

				beforeAll(() => {
					visitor = createVisitorThatHasMethods(methods);
					try{
						visit(tree, visitor.visitor);
					}catch(e){
						caughtException = e;
					}
				});

				it(`an exception should ${expectException ? '':'not'} have been thrown`, () => {
					if(expectException && !caughtException){
						fail('expected an exception to have been thrown')
					}
					if(!expectException && caughtException){
						throw caughtException;
					}
				});

				describe.each(methods.map(m => [m.methodName, m.expectedNodeTypes]))('the method', (methodName, expectedNodeTypes) => {

					it(`'${methodName}' should have been called with ${expectedNodeTypes.map(t => `'${t}'`).join(', ')}`, () => {
						expect(visitor.methodsToVerify[methodName].actualNodeTypes).toEqual(expectedNodeTypes);
					});
				});
			});
		});
	});
});