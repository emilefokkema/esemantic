var acorn = require('acorn');
var fs = require('fs');

var addCaseForScript = async function(script, module){
	var tree = module ? acorn.parse(script, {sourceType: 'module'}) : acorn.parse(script);
	var casesJson = await new Promise(function(res, rej){
		fs.readFile('visitor-cases.json', 'utf8', function(err, data){
			if(err){
				rej(err);
			}else{
				res(data);
			}
		});
	});
	var cases = JSON.parse(casesJson);
	cases.push({
		script: script,
		tree: tree,
		visitorCases: [
			{
				methods: [
					{
						methodName: 'Foo',
						expectedNodeTypes: ['Bar']
					}
				]
			}
		]
	});
	casesJson = JSON.stringify(cases, undefined, 1);
	await new Promise(function(res, rej){
		fs.writeFile('visitor-cases.json', casesJson, 'utf8', function(err){
			if(err){
				rej(err);
			}else{
				res();
			}
		});
	});
};

addCaseForScript(`export * from 'a'`, true).catch(function(e){console.log(e.stack);});
