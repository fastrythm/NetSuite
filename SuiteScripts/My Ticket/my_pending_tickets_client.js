


function onTicketStatusChange(type,name,lineNumber)
{
	if(name == 'custpage_form_status')
		{
		   var status = nlapiGetFieldValue('custpage_form_status');
		   		   
		   if(status != '-1')
			 {
			 			   
			   	var url = nlapiResolveURL('SUITELET', 'customscript_my_ticket_suite', 'customdeploy_my_ticket_suit_deploy');
				url += '&status='+status;
				window.onbeforeunload = function(){};
				window.location.href = url;
			 }
		}
}