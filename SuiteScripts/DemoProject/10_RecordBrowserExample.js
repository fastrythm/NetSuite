/**
 * This code provides an example on how the Record Browser feature works.
 *
 * Record browser can be accessed through the SuiteCloud IDE's main menu. Go to Help > Help Content and navigate to SuiteCloud IDE > Record Browser.
 * You can also access it by pressing Ctrl and hovering the mouse pointer over internal ID strings.
 * Depending on the context, if there are multiple possible records for a field, a menu will popup for record selection.
 */
 
function recordBrowserExample() {
	//#1 Press Ctrl, hover over, and click the following fields to launch the Record Browser.
	var rec1 = nlapiLoadRecord('customer', 2);
	rec1.setFieldText('balance', null);
	rec1.setLineItemValue('partners', 'id', line, value);
	 
	var rec2 = nlapiLoadRecord('account', 1);
	//#2a externalid is known to be a field for account record, so no popup menu will displayed.
	rec2.getFieldValue('externalid');
	
	var rec3 = nlapiLoadRecord(unknown(), 1);
	//#2b externalid is unknown, so a popup menu will be displayed.
	rec3.getFieldValue('externalid');
}
  