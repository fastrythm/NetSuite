/**
 * This code provides the following basic examples on how code completion works for:
 * - another parameter within the same function
 * - fields based on a selected record
 * - sublists based on a selected record
 * - sublist fields based on a selected record and a sublist
 * 
 * To activate internal ID code completion, place cursor inside the internal ID quote character--either single quote (') or double quote (") based on your preferred setting--and press Ctrl + Space.
 */

function contextLookupExample1() {
	//#1 Display the list of settings for the first parameter and the list of options for the second parameter (for FEATURE and PERMISSION only). 
	nlapiGetContext().getSetting('PERMISSION', '');
	
	//#2 transformtype will be displayed depending on the selected record (the first parameter in step #1).
	nlapiTransformRecord('customer', recId, '', transformValuesObj);
}

function contextLookupExample2() {
	//#3 List of all records will be displayed. Select salesorder.
	var rec = nlapiLoadRecord('salesorder', 1);
	
	//#4 All fields for the selected record (salesorder in step #3) will be displayed.
	rec.setFieldValue('', value);
	
	//#5 All sublists for the selected record (salesorder in step #3) will be displayed in rec.getLineItemCount(). 
	for (var i = 0, len = rec.getLineItemCount(''); i < len; i++) {
		
		//#6 All sublists for the selected record (salesorder in step #3) will be displayed in the first parameter; and the sublist fields for the selected sublist will be displayed in the second parameter.
		var value = rec.getLineItemField('', '', i);
		nlapiLogExecution('DEBUG', 'value = '+value);
	}
}
