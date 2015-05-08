var SqlParser = require('./index'),
	Parser = new SqlParser();

Parser.setQuery('CREATE TABLE');
console.log(Parser.validate());