

function getOtherCogsJournalDetails()
{
 
	 
		   var postingPeriod = nlapiGetFieldValue('custpage_postingperiodfield');
		   var subsidiary = nlapiGetFieldValue('custpage_subsidiary');
		   
		   if(postingPeriod != null && postingPeriod != '' && subsidiary != null && subsidiary != '' )
		   {
			    var parameters = postingPeriod.split("__");
				var postingId = parameters[0];
				
			   	var url = nlapiResolveURL('SUITELET', 'customscript_othercogsallocationjournal', 'customdeploy_othercogsallocationjournal');
				url += '&pp='+postingPeriod +'&sub='+subsidiary;
				window.onbeforeunload = function(){};
				window.location.href = url;
		   }
}