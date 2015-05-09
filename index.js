
/**
 * Version: 0.0.1
 * Description: This file deals with DDL statements exported within and .sql file, not all DDL statements.
 * 
 */

var Parser = function () {
	this.query;
	this.currentType;
	this.syntaxToUse;

	this.syntaxes = [
		{
			statement: "CREATE",
			syntaxes: [
				{
					what: "table",
					has_name: true,
					isLast: true
				}
			],
			should_have: [
				["`", "'", "plain"],
				["`", "'", "plain"],
				"(",
				")"
			]
		}
	];
}

Parser.prototype.exceptions = {
	NotValidException: function (message) {
		this.message = message;
		this.name = "NotValidException";
	}
}
// SETTERS
Parser.prototype.setQuery = function (query) {
	this.query = query;
	return this;
};

//GETTERS

Parser.prototype.getQuery = function () {
	return this.query;
};
Parser.prototype.getType = function () {
	this.statementType();
	return this.currentType;
};
Parser.prototype.getInformations = function () {
	var table_name = this.query.split(' ')[2],
		start = this.query.indexOf('('),
		end = this.query.lastIndexOf(')'),
		cols_part = this.query.substring(start + 1, end),
		columns = cols_part.split(',');	
	
	return {
		table_name: table_name,
		columns: columns
	}
};

// Identify string statement types
Parser.prototype.statementType = function () {
	var s = this.query;
	var sarray = s.split(" ");
	var first = sarray[0].toUpperCase();
	for (var index = 0, len = this.syntaxes.length; index < len; index++) {
		var currentSyntax = this.syntaxes[index]
		var currentStatement = currentSyntax.statement.toUpperCase();
		if (first === currentStatement) {
			this.syntaxToUse = currentSyntax;
			this.currentType = currentStatement;
			return this;
		}
	}
	// throw an error if can't identify the type ??
	// throw new NotValidException("Can't identify the statement type of : " + s);
	this.currentType = false;
	return this;
};
//TODO apply statement type to the string
Parser.prototype.validate = function () {
	if (!this.syntaxToUse) this.statementType();
	var should_have = this.syntaxToUse.should_have;
	for (var index = 0, len = should_have.length; index < len; index++) {
		var element = should_have[index];
		// verify if the current
		if (typeof (element) === "array") {

			for (var i = 0, len = this.query.length; i < len; i++) {


			}
		} else if (typeof (element) === "string") {

		}
	}
	return this.syntaxToUse;
};

//TODO parse the string

//TODO repeat the process for all the strings (ending with a semicolon)
module.exports = Parser;