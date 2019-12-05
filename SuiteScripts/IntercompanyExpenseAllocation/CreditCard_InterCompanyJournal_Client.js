

function getCreditCardJournalDetails()
{
 
	 
		   var postingPeriod = nlapiGetFieldValue('custpage_postingperiodfield');
 	 		
		   if(postingPeriod != null && postingPeriod != '')
		   {
			    var parameters = postingPeriod.split("__");
				var postingId = parameters[0];
				
			   	var url = nlapiResolveURL('SUITELET', 'customscript_creditcardintercompanyjouna', 'customdeploy_creditcardintercompanyjouna');
				url += '&pp='+postingPeriod;
				window.onbeforeunload = function(){};
				window.location.href = url;
		   }
}