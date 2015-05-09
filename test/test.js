/// <reference path="../typings/mocha/mocha.d.ts"/>
var should = require('chai').should(),
	expect = require('chai').expect(),
	SqlParser = require('../index'),
	Parser = new SqlParser(),
	query = "CREATE TABLE `City` (`ID` int(11) NOT NULL AUTO_INCREMENT,`Name` char(35) NOT NULL DEFAULT '',`CountryCode` char(3) NOT NULL DEFAULT '',`District` char(20) NOT NULL DEFAULT '',`Population` int(11) NOT NULL DEFAULT '0', PRIMARY KEY (`ID`)) ENGINE=MyISAM AUTO_INCREMENT=4080 DEFAULT CHARSET=latin1;";

describe('Parser', function () {
	describe('#statementType()', function () {
		it('Should return CREATE', function () {
			Parser.setQuery(query).getType().should.equal('CREATE');
		});
		it('Should return FALSE', function () {
			Parser.setQuery('BRIN TABLE').getType().should.equal(false);
		});
	});

	describe('#getInformations()', function () {
		it('Should return a string', function () {
			Parser.setQuery(query).getInformations().table_name.should.be.a('string');
		});
		it('Should return an array of columns', function () {
			Parser.setQuery(query).getInformations().columns.should.be.a('array');
		});
		it('Should return an object', function () {
			Parser.setQuery(query).getInformations().should.be.a('object');
		});
		it('Should not return an empty table name', function () {
			Parser.setQuery(query).getInformations().should.have.property('table_name');
			Parser.setQuery(query).getInformations().table_name.should.not.be.a('undefined');
		});
		
		it('Should return false if there is no table name', function () {
			Parser.setQuery('CREATE SOMETHING').getInformations().should.be.a('boolean');
			Parser.setQuery('CREATE SOMETHING').getInformations().should.equal(false);			
		});
	});
});
