/**
 * This code provides an example on how code completion works with JSDoc tags applied to object literals.
 */

var objectLiteral = {
	property : nlapiLoadRecord('account'),
	
	nested : {
		property : nlapiLoadRecord('salesorder'),
		
		/**
		 * @param {nlobjRecord} rec1
		 * @record calendarevent
		 * 
		 * @returns {nlobjRecord}
		 * @record cashsale
		 */
		method : function(rec1) {
			//Demonstrate how tags work for object literal parameter.
			//#1 Fields for event will be displayed.
			rec1.getFieldValue(''); 
			return null;
		}
	},

	/**
	 * @param {nlobjRecord} rec2
	 * @record employee
	 * 
	 * @returns {nlobjRecord}
	 * @record customer
	 */
	method : function(rec2) {
		rec2.getFieldValue('email'); 
		return null;
	}
};

//Demonstrate how tags work for object literal property.
//#2 Fields for account will be displayed
objectLiteral.property.setFieldValue('', null); 

//Demonstrate how tags work for object literal method.
//#3 Fields for customer will be displayed
objectLiteral.method().setFieldValue('', null);

//Demonstrate how tags work for nested object literal property.
//#4 Fields for salesorder will be displayed.
objectLiteral.nested.property.setFieldValue('', null);

//Demonstrate how tags work for nested object literal method.
//#5 Fields for cashsale will be displayed.
objectLiteral.nested.method(null).setFieldValue('', null); 

