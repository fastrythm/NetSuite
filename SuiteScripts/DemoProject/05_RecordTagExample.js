/**
 * This code provides an example on how code completion works with the @record tag for function parameters, function returns, and variable declarations.
 * 
 * The @record tag can be added below the @param and @returns JSDoc tags. 
 * There can be multiple @record tags, and the resulting fields are combined from multiple records.
 * It can be used in conjunction with @param, @returns, and @type JSDoc tags.* 
 */

/**
 * @param {nlobjRecord} recordObject  comment here
 * @record salesorder 
 * @record account
 * 
 * @returns {Boolean}
 */
function recordTagExample(recordObject) { 
	
	//Demonstrate how to set the record and type for a function parameter.  
	//#1 Fields for salesorder and account will be displayed because we have @record tags under the @param line.
	recordObject.setFieldValue('', null);

	var rec = getRecord();
	//Demonstrate how to set the record and type for a function return. See the JSDoc comment for the getRecord function below.
	//#2 Fields for cashsale will be displayed.
	rec.setFieldValue('', null);
	
	/** @type nlobjRecord
	 *  @record customer
	 */
	var cust = getCustomer();
	//Demonstrate how to use @record tag in conjunction with @type tag for code completion of internal IDs.	
	//#3 Fields for customer will be displayed.
	cust.setFieldValue('', null);
	
	return true;   
}

/**
 * This specifies that the function will return an nlobjRecord type which is a cashsale record.
 * 
 * @returns {nlobjRecord} NetSuite record object
 * @record cashsale
 */
function getRecord() { 
	return null;
} 

/**
 * No JSDoc tags for this function
 */
function getCustomer() {
	
}
