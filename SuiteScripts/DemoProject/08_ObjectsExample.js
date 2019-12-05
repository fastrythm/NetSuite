/**
 * This code provides an example of how code completion works with tags applied to object and object inheritance.
 */
 
/* Simple object */

var simpleObject = {};

simpleObject.property = nlapiLoadRecord('bintransfer');

/**
* @param {nlobjRecord} rec
* @record salesorder
* 
* @returns {nlobjRecord}
* @record transferorder
*/
simpleObject.method = function(rec) {
	//Demonstrate how tags work for object method parameter.
	//#1 Fields for salesorder will be displayed.	
	rec.getFieldValue(''); 
};

//Demonstrate how tags work for object property.
//#2 Fields for bintransfer will be displayed.	
simpleObject.property.setFieldValue('', 1); 

//Demonstrate how tags work for object method return.
//#3 Fields for transferorder will be displayed.	
simpleObject.method().setFieldValue('', value); 



/* Object inheritance example */

var PrimaryObject = new Object();

/** @type nlobjRecord */
PrimaryObject.prototype.property = nlapiLoadRecord('assemblybuild');

/**
* @param {nlobjRecord} rec
* @record salesorder
* 
* @returns {nlobjRecord}
* @record customer
*/
PrimaryObject.prototype.method = function(rec) {
	rec.getFieldValue(''); //Fields for salesorder will be displayed.
};

SecondaryObject.prototype = new PrimaryObject();
SecondaryObject.prototype.constructor = SecondaryObject;

/** @type nlobjRecord */
SecondaryObject.prototype.newProperty = nlapiLoadRecord('account');

/**
 * @returns {nlobjRecord}
 * @record campaign
 */
SecondaryObject.prototype.newMethod = function() { };

var objectInstance = new SecondaryObject();

//Demonstrate how tags work for inherited property from PrimaryObject.
//#4 Fields for assemblybuild will be displayed.
objectInstance.property.setFieldValue('', null);

//Demonstrate how tags work for inherited property from SecondaryObject.
//#5 Fields for account will be displayed.
objectInstance.newProperty.setFieldValue('', null);

//Demonstrate how tags work for inherited method from PrimaryObject.
//#6 Fields for customer will be displayed.
objectInstance.method().setFieldValue('', null);

//Demonstrate how tags work for inherited method from SecondaryObject.
//#7 Fields for campaign will be displayed.
objectInstance.newMethod().setFieldValue('', null);

