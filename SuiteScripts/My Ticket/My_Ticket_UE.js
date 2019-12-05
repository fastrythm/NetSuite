/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Sep 2018     sohail.ahmed
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeLoad(type, form, request){
	try{
		
		var id = nlapiGetRecordId();
		var record= nlapiLoadRecord('customrecord_my_ticketing_system',id);
		var status = record.getFieldValue('custrecord_my_ticket_status');
		
	    if(type == 'view' && status == 2 )
	    {
	    	 
	    }
	    
	   
		nlapiLogExecution('DEBUG','type',type);
		var context = nlapiGetContext();
		var user = context.getUser();
	   
	  
		nlapiLogExecution('DEBUG','Current User ID = ',user);
		
		 if(type == 'view' && user == 65144 && status == 1)
		{
		    
			form.setScript('customscript_my_ticket_client');	
			form.addButton('custpage_custombtn_resolve', 'Resolve', 'onResolveClick()');
	
		}
	
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func userEventBeforeLoad in My Ticket module',ex.toString());
	}
 
}



/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function userEventBeforeSubmit(type){
 
}
