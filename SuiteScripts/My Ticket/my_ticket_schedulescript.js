/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Sep 2018     sohail.ahmed
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduled(type) {
	try{

		//if(type == 'scheduled')
		{
			var records = getExpireOpenTickets();
			nlapiLogExecution('DEBUG','Open total tickets found  ',records.length);
			for(var i=0;i<records.length; i++)
			{
				var record = records[i];
				var resolverUserId = record.getValue('custrecord_my_ticket_resolver');
				nlapiLogExecution('DEBUG','ticket resolver id',resolverUserId);
				
				var creatorUserId = record.getValue('custrecord_ticket_generator');
				nlapiLogExecution('DEBUG','ticket creator id',creatorUserId);
				
				var resolverEmail = nlapiLookupField('employee',resolverUserId,'email');
				nlapiLogExecution('DEBUG','ticket resolver email',resolverEmail);
				
		 
				
				nlapiSendEmail(creatorUserId, resolverEmail, 
			               'Ticket Not Approved', 'New ticket has been pending.', 
			               null, null, null, null, true, null);
				
				var recordId =  record.getId();
				var ticketrecord = nlapiLoadRecord('customrecord_my_ticketing_system',recordId);
				ticketrecord.setFieldValue('custrecord_my_ticket_notification','T');
	    		nlapiSubmitRecord(ticketrecord); 
				
			}
			
		}		
	}
	catch(ex)
	{
		nlapiLogExecution('ERROR','error in func scheduled',ex.toString());
	}

}


function getExpireOpenTickets()
{
	try{
		 
		
		    var search = nlapiLoadSearch('customrecord_my_ticketing_system','customsearch_ticketing_sys_date_expire');
		 
			var res = search.runSearch();
			var results = res.getResults(0,1000);
		 
		
		return results;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func getExpireOpenTickets',ex.toString());
	}
}
