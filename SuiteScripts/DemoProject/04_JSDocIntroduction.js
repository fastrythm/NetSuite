/**
 * SuiteScript is a dynamically-typed language so it is difficult to determine the type of a variable just by looking at the code.
 * Developers can specify the missing type information by using JSDoc tags which is based on JavaDoc.
 * 
 * JSDoc can be used whenever the variable type can not be determined automatically.
 * For example:
 * 		var rec = nlapiLoadRecord('cashsale', 1);  //There is no need to use JSDoc tags here, the SuiteCloud IDE can determine that rec is of the nlobjRecord type, specifically that of cashsale.
 * 
 * However, when you are working with your own functions, it becomes harder to determine the nlobjRecord type.
 * 		var rec = customFunction();   //The SuiteCloud IDE will not know the type returned unless JSDoc tags are used.  
 *
 * This code provides an example on how code completion works with JSDoc support--particularly that of standard JSDoc tags.   
 */


/* This is a normal comment but not a JSDoc comment. */
/** 
 * This is a JSDoc comment. Take note of the double asterisks. The shortcut in Eclipse is to type /** above a function and press Enter. 
 */


/* The following is the format of a standard JS Doc comment */ 
/**
 * @param {parameterType} parameterName ParameterDescription
 * @returns {returnType} ReturnsDescription
 */
function functionName(parameterName) {
	return null;
}

/* Usage example: */
/**
 * @param {String} id Record Internal ID
 * @returns {nlobjRecord} Returns a NetSuite record object
 */
function example(id) {
	return null;
}


/* Using the @type to specify the variable type */

function func() { 
	return null; 
}

function typeExample() {
	var rec1 = func();
	//#1 Try Ctrl + Space after "rec1." 
	//There will be no code completion proposal because rec1's type is unknown.
	rec1.
	
	/** @type nlobjRecord */
	var rec2 = func();
	//#2 Try Ctrl + Space after "rec2."
	//With the @type tag specified, the SuiteCloud IDE knows it is of the type nlobjRecord and will then display its methods.
	//However, please note that for this particular case, even if the type is known to be nlobjRecord, it is hard to determine what record it is (whether it is salesorder, account, and so on).
	//Determining the kind of record to use will be handled by another JSDoc tag that will be discussed later.
	rec2.
}

/* At this point, everything mentioned in this file is standard JSDoc. No custom NetSuite tags have been mentioned yet. 
   In the succeeding codes, the custom NetSuite JSDoc tags (@appliedtorecord and @record) and how they work with standard JSDoc tags will be discussed. */

