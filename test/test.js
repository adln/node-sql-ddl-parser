/// <reference path="../typings/mocha/mocha.d.ts"/>
var should = require('chai').should(),
	SqlParser = require('../index'),
	Parser = new SqlParser();
	
describe('Parser.statementType()',function () {
	it('Should return CREATE',function () {		
		Parser.setQuery('CREATE TABLE').getType().should.equal('CREATE');
	});
	it('Should return FALSE',function () {		
		Parser.setQuery('BRIN TABLE').getType().should.equal(false);
	});
	
});