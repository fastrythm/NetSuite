/**
 * This code provides an example on how code completion works with the @appliedtorecord tag in client and user event scripts.
 * 
 * The @appliedtorecord tag is set at function level. This corresponds to the "Applied To" record in the script deployment; and 
 * is applicable only for functions that rely on the aforementioned "Applied To" field.
 * 
 * There can be multiple tags and the resulting fields are combined from multiple records. 
 * For example, in a client script with On Save event, the tag will let the SuiteCloud IDE know that you are working with a "customer" and "lead" record
 * and it will display fields for the two records in your function calls. In the absence of these tags, fields for all records will be displayed.
 */


//#1 Create a JSDoc comment above a function and add the @appliedtorecord tag and record type.
/**
 * @appliedtorecord customer
 * @appliedtorecord lead
 *   
 */
function clientSaveRecord(){
	//#2 When using functions that rely on the script deployment record type such as nlapiGetOldRecord,
	//   fields will be displayed for customer and lead only in the parameter for oldRec.getFieldText().
	var oldRec = nlapiGetOldRecord();
	var oldName = oldRec.getFieldText(''); 
	
	var newRec = nlapiGetNewRecord();
	var newName = newRec.getFieldValue('entityid');

	//#3 The same thing is true for sublists and sublist fields 
	nlapiGetCurrentLineItemValue('', '');
	
	return (oldName!=newName);  
}
