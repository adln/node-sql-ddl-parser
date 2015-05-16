
/**
 * Version: 0.0.1
 * Description: This file deals with DDL statements exported within and .sql file, not all DDL statements.
 * 
 */

require('./helper');
/**
 * Table informations : {
 * 	name: String,
 * 	fields: [
 * 		{
 * 			name : String,
 * 			data_type: String,
 * 			not_null: Boolean,
 * 			default: String,
 * 			primary_key: Boolean
 * 		}
 * 	]
 * }
 */
var Parser = function () {
	this.query;
	this.currentType;
	this.syntaxToUse;

	this.syntaxes = [
		{
			statement: "CREATE",
			syntaxes: ["CREATE TABLE", "CREATE TEMPORARY TABLE"],
			should_have: [
				["`", "'", "plain"],
				["`", "'", "plain"],
				"(",
				")"
			]
		}
	];
}

Parser.prototype.NotValidException = function (message) {
	this.message = message;
	this.name = "NotValidException";
};
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
/*Parser.prototype.validate = function () {
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
};*/

// Transform succession of whites spaces to one space
Parser.prototype.whites_to_one = function (s) {
	return s.replace(/[\s+]/g, ' ').replace(/^\s/g, '');
};
Parser.prototype.purify = function (s) {
	return s.replace(/[`']/g, '');
};


/**
 * Parse the columns part of the CREATE statement
 * return { columns: Array, Constraints: Array}
 */
Parser.prototype.parseColumns = function (cols) {
	var columns = [];

	for (var index = 0, len = cols.length; index < len; index++) {
		var element = cols[index],
			obj = {},
			has_not_null = false,
			constraints_mask = ["FOREIGN", "KEY", "PRIMARY", "UNIQUE"],
			constraints = [],
			splited_element;

		element = this.purify(element);
		element = this.whites_to_one(element);

		splited_element = element.split(' ');

		if (element[2].toUpperCase() === 'NOT') has_not_null = true;
		// add the constraints to the constraints attribute 
		if (constraints_mask.indexOf(splited_element[0].toUpperCase()) !== -1) {
			constraints.push(element);
		} else {
			obj.name = splited_element[0];
			obj.type = splited_element[1];
			obj.null = splited_element[2] + (has_not_null ? ' ' + splited_element[3] : '');
			obj.default = has_not_null ? splited_element[4] : splited_element[3];

			columns.push(obj);
		}

	}

	return { columns: columns, constraints: constraints };
};

//Parse the string
Parser.prototype.getTableInformations = function () {

	var table_name,
		start = this.query.indexOf('('),
		end = this.query.lastIndexOf(')'),
		cols_part = this.query.substring(start + 1, end),
		columns = cols_part.split(','),
		syntaxes = this.statementType().syntaxToUse.syntaxes,
		table_name_index = 0;
	// Parse table name
	// get the table_name_index
	for (var index = 0, len = syntaxes.length; index < len; index++) {
		var syntax = syntaxes[index],
			valid = true;		
		//	verify the syntaxes to get the actual syntax
		
		for (var i = 0, arr = syntax.split(' '), l = arr.length; i < l; i++) {
			var syntaxElement = arr[i],
				queryElement = this.query.split(' ')[i];

			if (syntaxElement !== queryElement) valid = false;
		}
		if (valid === true) { table_name_index = syntax.split(' ').length; break; }
	}

	if (!valid) return false;

	table_name = this.query.split(' ')[table_name_index];

	if ((table_name.indexOf(')') >= 0) || (table_name.indexOf('(') >= 0)) return false;	
	
	// TODO Parse columns
	
	
	

	return {
		table_name: this.purify(table_name),
		definition: this.parseColumns(columns)
	}


};


//TODO repeat the process for all the strings (ending with a semicolon)
module.exports = Parser;