/**
 * This code provides an example on how basic validation features work.
 * 
 * Users can create an ignore list (text file with internal ID on each line) for new IDs that are not yet supported by IDE. See SuiteCloud IDE Validation Preferences.
 * Custom records and fields are not validated.
 */
 
function validationExample() {
	var rec1 = nlapiLoadRecord('salesorder', 2);
	//Demonstrate validation with spelling correction. (Click the icon on the marker bar.)
	//Note: If there are multiple errors on the same line, the validation entry might be obscured by another error.
	//#1 An error marker for misspelled internal ID will be displayed.
	rec1.setFieldText('altshipingcost', '');
	 
	var rec2 = nlapiLoadRecord('account', 1);
	rec2.getFieldValue('acctname');
	//#2 A warning marker will be displayed. The internal ID is spelled correctly but a possible incorrect usage exists
	//   since salesdescription is not a valid field for account. It is a field for salesorder.
	//   (Click the icon on the marker bar.)
	rec2.setFieldValue("salesdescription");
	
	//Demonstrate custom records are not validated.
	var rec3 = nlapiLoadRecord('custrecord_test', 1);
	rec3.getFieldValue('cust_name');
}
  