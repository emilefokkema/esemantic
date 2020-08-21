var fs = require('fs');

var writeCasesJs = async function(){
	var casesJson = await new Promise(function(res, rej){
		fs.readFile('test/visitor-cases.json', 'utf8', function(err, data){
			if(err){
				rej(err);
			}else{
				res(data);
			}
		});
	});
	var scriptText = `export default ${casesJson};`;
	await new Promise(function(res, rej){
		fs.writeFile('test/visitor-cases.js', scriptText, 'utf8', function(err){
			if(err){
				rej(err);
			}else{
				res();
			}
		});
	});
};

writeCasesJs().catch(function(e){console.log(e.stack);});