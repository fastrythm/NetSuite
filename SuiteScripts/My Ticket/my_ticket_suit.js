
function main(req, res){
	try{
		if(req.getMethod()==='POST'){
			 
			handlePostRequest(req,res);
			handleGetRequest(req,res);
		}else{
			handleGetRequest(req,res);
		}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func main in my_ticket_suit.js file',ex.toString());
	}
}


function handleGetRequest(req,res){
	try{
		var filterObj = {};
		filterObj.status = req.getParameter('status');
		nlapiLogExecution('DEBUG','Ticket Status',filterObj.status);
		
		var tickets = getFilterTicketsByStatus(filterObj);
		var rows = [];
		if(tickets && tickets.length>0){
			for(var i=0;i<tickets.length;i++){
				rows.push({	
					custpage_myticket_id : tickets[i].getId(),
					custpage_myticket_title : tickets[i].getValue('custrecord_my_ticket_title'),
					custpage_myticket_status : tickets[i].getText('custrecord_my_ticket_status'),
					custpage_myticket_priority : tickets[i].getValue('custrecord_priority'),
					custpage_myticket_requiredatetime : tickets[i].getValue('custrecord_required_date_time'),			
					custpage_myticket_resolvedatetime : tickets[i].getValue('custrecord_resolve_date_time'),			
			 
				});
			}
		}
		
		var form = nlapiCreateForm('My Tickets List');
		
		form.setScript('customscript_my_pending_ticket_client');	
		
		var ticketStatus = form.addField('custpage_form_status','select','Status','customlist_my_ticket_status');
 
		
		var list = form.addSubList('my_tickets', 'list', 'My Tickets List');
		list.addMarkAllButtons();
		if(filterObj.status == 1)
		list.addField('custpage_chkrow','checkbox','Select');
		else
			list.addField('custpage_chkrow','checkbox','Select').setDisplayType('hidden');
		
		list.addField('custpage_myticket_id','text','MyTicketId').setDisplayType('hidden');
		list.addField('custpage_myticket_title','text','Title').setDisplayType('disabled');
		list.addField('custpage_myticket_status','text','Status').setDisplayType('disabled');
		list.addField('custpage_myticket_priority','text','Priority').setDisplayType('disabled');
		list.addField('custpage_myticket_requiredatetime','text','Require Date Time').setDisplayType('disabled');
		list.addField('custpage_myticket_resolvedatetime','text','Resolve Date').setDisplayType('disabled');
		list.setLineItemValues(rows);
		 
		
		form.addSubmitButton('Submit');
		
		if(filterObj.status != null && filterObj.status != ''){
			ticketStatus.setDefaultValue(filterObj.status);
		}
		 
		res.writePage(form);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handleGetRequest',ex.toString());
	}
}


function getFilterTicketsByStatus(filterObj)
{
	try{
		var fils = new Array();
		
		var search = nlapiLoadSearch('customrecord_my_ticketing_system','customsearch_mytickets');
		if(filterObj.status != '')
			{
		    fils.push(new nlobjSearchFilter('custrecord_my_ticket_status',null,'is',filterObj.status));
		 	search.addFilters(fils);
			}
			var res = search.runSearch();
			var results = res.getResults(0,1000);
		 
		
		return results;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func getFilterTicketsByStatus',ex.toString());
	}
}

 

function handlePostRequest(req,res)
{
	try{
	var lineCount = req.getLineItemCount('my_tickets');	
	
	nlapiLogExecution('DEBUG','Selected Item Count is',lineCount);
	
	var paymentObject = {};
 	
	for(var i=1; i<=lineCount; i++) {
    	
    	if(req.getLineItemValue('my_tickets','custpage_chkrow',i) == 'T')
    	{
    		var ticketId = req.getLineItemValue('my_tickets','custpage_myticket_id',i) 
    		
    		var record = nlapiLoadRecord('customrecord_my_ticketing_system',ticketId);
    		
    		var d  = new Date();
    		var datetime = nlapiDateToString(d, 'datetimetz');
    		
    		record.setFieldValue('custrecord_my_ticket_status',2);
    		record.setFieldValue('custrecord_resolve_date_time',datetime);
    		
    		
    		var requiredDate = record.getFieldValue('custrecord_required_date_time');
    		var reqDateObj = new Date(requiredDate);
    		
    	 
    		 var diff =(reqDateObj.getTime() - d.getTime()) / 1000;
    		 diff /= 60;
    		 var value  = (Math.round(diff));
    		
    		 
    		 nlapiLogExecution('DEBUG','Time Difference ',value);
    		 
    		record.setFieldValue('custrecord_my_ticket_time_taken',value);
    		
    		
    		nlapiSubmitRecord(record); 
    		
    	}
    
	}
	
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handlePostRequest',ex.toString());
	}
}
