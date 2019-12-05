/**
 * This code provides an example on how code completion works for the search record API.
 * 
 * To activate internal ID code completion, place cursor inside the internal ID quote character--either single quote (') or double quote (") based on your preferred setting--and press Ctrl + Space.
 */

function searchExample1() {
	//#1 Search filter fields for purchaseorder will be displayed.
	var filters = [ new nlobjSearchFilter('', null, 'anyof', 1) ];
	//#2 Search column fields for purchaseorder will be displayed.
	var columns = [ new nlobjSearchColumn('amount', null, 'sum') ];
	var results = nlapiSearchRecord('purchaseorder', 'customsearch_po', filters, columns);
	if (results) {
		for ( var i = 0, len = results.length; i< len; i++) {
			var rec = results[i];
			//#3 search column fields will be displayed
			var x = rec.getValue('');
			nlapiLogExecution('DEBUG', 'balance = '+x);
		}
	}
}

function searchExample2() {
	//Demonstrate basic support for assignment of variables to record parameters.
	//recordType is either assigned to salesorder or account depending on a set condition. 
	var recordType = 'salesorder';
	if (true || false) {
		recordType = "account";
	}
	var res = nlapiSearchRecord(recordType, null,
								//#4 Search filter fields will be displayed for both salesorder and account. That is if prefix filter is not used.
			                    [ new nlobjSearchFilter('', null, 'is', 1) ],			                    
			                    //Demonstrate the use of a prefix filter to further filter the number of options displayed.
			                    //Use a space within the internal id string to separate the prefix for a record type from the prefix for an internal ID. 
			                    //For example, "s b" will display salesorder fields starting with the letter "b"
			                    //             "a b" will display account fields starting with the letter "b"			                    
			                    //#5 Search column fields will be displayed.
			                    [ new nlobjSearchColumn('') ]);
	if (res) {
		for ( var i = 0, len = results.length; i< len; i++) {
			var rec = res[i];
			//#6 Search column fields will be displayed.
			var x = rec.getValue('');
			nlapiLogExecution('DEBUG', 'balance = '+x);
		}
	}	
}

/* The rest are the same, but have variations on the code syntax recognized by the IDE */

function searchVariation1() {
	var filter = new Array();
	//Demonstrate syntax recognition for new array and push. 
	//#7 Fields for event will be displayed.
	filter.push(new nlobjSearchFilter('', null, 'is', 1));
	var res = nlapiSearchRecord('calendarevent', null, filter);
	nlapiLogExecution('DEBUG', 'len = '+(res==null) ? 0 : res.length);
}

function searchVariation2() {
	//Demonstrate syntax recognition for adding to an array through another variable.
	//#8 Fields for assemblyitem will be displayed.
	var f = new nlobjSearchFilter('internalid', null, 'is', 1);
	var filter = new Array();
	filter.push(f);
	var res = nlapiSearchRecord('assemblyitem', null, filter);
	nlapiLogExecution('DEBUG', 'len = '+(res==null) ? 0 : res.length);
}

function searchVariation3() {
	var filter = [];
	//Demonstrate syntax recognition for adding to an array using indexed access. 
	//#9 Fields for campaign will be displayed.	
	filter[0] = new nlobjSearchFilter('internalid', null, 'is', 1);
	var res = nlapiSearchRecord('campaign', null, filter);
	nlapiLogExecution('DEBUG', 'len = '+(res==null) ? 0 : res.length);
}
 
