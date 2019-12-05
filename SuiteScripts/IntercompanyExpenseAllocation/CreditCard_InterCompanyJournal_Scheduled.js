
/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 SEP 2019     Sohail.Ahmed
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */



function scheduled(type) {
	try{
		var context = nlapiGetContext();
		var paymentObject = {};
		var accountingPeriod = context.getSetting('SCRIPT', 'custscript_postingperiodfield');
		var index = context.getSetting('SCRIPT', 'custscript_indexfield');
		
	  
		createRecord(accountingPeriod,index);
		 
	 
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func scheduled',ex.toString());
	}
}


function createRecord(postingPeriod,index)
{
	try{
	        
		    if(index == '' || index == null)
	    	{
		    	index = 0;
	    	}
		    else if(index > 0)
	    	{
		    	index = parseInt(index) + 1;
	    	}
		
		    var context = nlapiGetContext();
		
         	var fils = new Array();
            var cols = new Array();
            var creditCardAccount = new nlobjSearchColumn('custrecord_ccaccounts');
            var creditCardSubsidiary = new nlobjSearchColumn('custrecord_ccsubsidiary');
            var ccpCreditCardAccount = new nlobjSearchColumn('custrecord_cppcreditcardaccount');
            var cppCreditCardSubsidiary = new nlobjSearchColumn('custrecord_cppsubsidiary');
            var creditDueFromAccount = new nlobjSearchColumn('custrecord_ccduefromaccount');
            var creditCardDueToAccount = new nlobjSearchColumn('custrecord_ccduetoaccount');
            
            cols.push(creditCardAccount);
            cols.push(creditCardSubsidiary);
            cols.push(ccpCreditCardAccount);
            cols.push(cppCreditCardSubsidiary);
            cols.push(creditDueFromAccount);
            cols.push(creditCardDueToAccount);
		 
          var searchResults = nlapiSearchRecord('customrecord_creditcardaccountmapping', null, fils, cols);
          nlapiLogExecution('DEBUG','Credit Card Account Mapping Total Records',searchResults.length);
          if(searchResults.length < 0)
          { return false; }
          
          nlapiLogExecution('DEBUG','postingperiodfield',postingPeriod);
		  nlapiLogExecution('DEBUG','Index Number',index);
          
          for ( var i = index; i < searchResults.length; i++ )
		  {
        	   var searchresult = searchResults[i];
        	   var creditCardAccountId = searchresult.getValue(creditCardAccount);
			   var creditCardSubsidiaryId = searchresult.getValue(creditCardSubsidiary);
			   var ccpCreditCardAccountId = searchresult.getValue(ccpCreditCardAccount);
			   var cppCreditCardSubsidiaryId = searchresult.getValue(cppCreditCardSubsidiary);
			   var creditDueFromAccountId = searchresult.getValue(creditDueFromAccount);
			   var creditCardDueToAccountId = searchresult.getValue(creditCardDueToAccount);
			   
			   
			    
			   var accountingPeriod = null;
			   var postingperiodfield   = postingPeriod;
			  
			   
			   if(postingperiodfield != null && postingperiodfield != '')
			   {
				   var parameters = postingperiodfield.split("__");
					 var postingId = parameters[0];
					 var endDate = parameters[1];
					 var amount = 0;
			          amount = getAmountFromCreditCardTransaction(creditCardAccountId,creditCardSubsidiaryId,postingId);
			     
				     if(amount > 0)
			    	 {
				     
				    	   
				    	  var  record = nlapiCreateRecord('advintercompanyjournalentry');
						   record.setFieldValue('subsidiary', cppCreditCardSubsidiaryId);
						   record.setFieldValue('trandate', endDate);
						   
						   
				           record.selectNewLineItem('line');
						   record.setCurrentLineItemValue('line', 'linesubsidiary', cppCreditCardSubsidiaryId);
						   record.setCurrentLineItemValue('line', 'duetofromsubsidiary', creditCardSubsidiaryId); 
				           record.setCurrentLineItemValue('line', 'account', creditDueFromAccountId);
				           record.setCurrentLineItemValue('line', 'debit', amount);
				           record.setCurrentLineItemValue('line', 'eliminate', 'T');
				           record.commitLineItem('line');
				           
				           
				           nlapiLogExecution('DEBUG','Due From Statement',' linesubsidiary : '+ cppCreditCardSubsidiaryId +', account : '+ creditDueFromAccountId +', debit : '+ amount +', eliminate : T, duetofromsubsidiary : '+creditCardSubsidiaryId);
						
				           
				           record.selectNewLineItem('line');
				           record.setCurrentLineItemValue('line', 'linesubsidiary', cppCreditCardSubsidiaryId);
				           record.setCurrentLineItemValue('line', 'account', ccpCreditCardAccountId);
				           record.setCurrentLineItemValue('line', 'credit', amount);
				           
				           nlapiLogExecution('DEBUG','CC Statement',' linesubsidiary : '+ cppCreditCardSubsidiaryId +', account : '+ ccpCreditCardAccountId +', credit : '+ amount );
							
				          
				           record.commitLineItem('line');
				           
						   record.selectNewLineItem('line');
						   record.setCurrentLineItemValue('line', 'linesubsidiary', creditCardSubsidiaryId);
				           record.setCurrentLineItemValue('line', 'account', creditCardAccountId);
				           record.setCurrentLineItemValue('line', 'debit', amount);
				           record.commitLineItem('line');
				           
				           nlapiLogExecution('DEBUG','CC Statement',' linesubsidiary : '+ creditCardSubsidiaryId +', account : '+ creditCardAccountId +', debit : '+ amount );
							
				           
				           record.selectNewLineItem('line');
				           record.setCurrentLineItemValue('line', 'linesubsidiary', creditCardSubsidiaryId);
				           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', cppCreditCardSubsidiaryId); 
				           record.setCurrentLineItemValue('line', 'account', creditCardDueToAccountId);
				           record.setCurrentLineItemValue('line', 'credit', amount);
				           record.setCurrentLineItemValue('line', 'eliminate', 'T');
				           record.commitLineItem('line');
				           
				           nlapiLogExecution('DEBUG','Due to Statement',' linesubsidiary : '+ creditCardSubsidiaryId +', account : '+ creditCardDueToAccountId +', credit : '+ amount +', eliminate : T, duetofromsubsidiary : '+cppCreditCardSubsidiaryId);
							
				         
				           
				           var journalentryId =  nlapiSubmitRecord(record);
						   nlapiLogExecution('DEBUG','Journal Entry Id ',journalentryId);
						   
						   if(journalentryId != null && journalentryId != '')
						   {
							   	 var  creditCardJournal =  nlapiCreateRecord('customrecord_creditcardjournalmapping');
							 
								 creditCardJournal.setFieldValue('custrecord_creditcardid',creditCardAccountId);
								 creditCardJournal.setFieldValue('custrecord_creditcardsubsidiary',creditCardSubsidiaryId);
								 creditCardJournal.setFieldValue('custrecord_creditcardpostingperiod',postingId);
								 creditCardJournal.setFieldValue('custrecord_creditcardamount',amount);
								 creditCardJournal.setFieldValue('custrecord_advanceintercompanyjournal',journalentryId);
					           
				                 nlapiSubmitRecord(creditCardJournal);
						   }
						   
			    	 }
			   }
			   
			   var remainingUsage = context.getRemainingUsage();
			   if( remainingUsage <= 1000)
			   {
				    nlapiLogExecution('DEBUG','reschedule','reschedule');
				    nlapiLogExecution('DEBUG','Remaining Usage',remainingUsage);
					rescheduleScript(postingPeriod,i);
					
					return;
			   }
			
		  }
      
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handlePostRequest',ex.toString());
	}
}

function getAmountFromCreditCardTransaction(creditCardAccountId,creditCardSubsidiaryId,postingperiodfield)
{
	try{
		
		var fils = new Array();
	    var search = nlapiLoadSearch('transaction','customsearch_cppcctransaction');
	    fils.push(new nlobjSearchFilter('account',null,'is',creditCardAccountId));
	    fils.push(new nlobjSearchFilter('subsidiary',null,'is',creditCardSubsidiaryId));
	    fils.push(new nlobjSearchFilter('postingperiod',null,'is',postingperiodfield));
	  	search.addFilters(fils);
		
	  	var amount = new nlobjSearchColumn('amount', null, 'sum');
	  	var account = new nlobjSearchColumn('account', null, 'group');
	  	var period = new nlobjSearchColumn('postingperiod', null, 'group');
	  	var subsidiary = new nlobjSearchColumn('subsidiary', null, 'group');
	  	
	 	search.addColumn(amount);
	 	search.addColumn(account);
	 	search.addColumn(period);
	 	search.addColumn(subsidiary);
	 
		var res = search.runSearch();
		var results = res.getResults(0,1000);
		
		var creditCardAmount = 0;
	//	nlapiLogExecution('DEBUG','CPP_Credit Card Transactions total records ',results.length);
		
		for(var i=0;i<results.length;i++)
		{
			creditCardAmount = results[i].getValue(amount);
		}
		
		nlapiLogExecution('DEBUG','Transaction','creditCardAccountId :'+creditCardAccountId+', creditCardSubsidiaryId :'+creditCardSubsidiaryId+', postingperiodfield :'+postingperiodfield+', creditCardAmount :'+creditCardAmount);
		return creditCardAmount;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func getAmountFromCreditCardTransaction',ex.toString());
	}
}



 
function rescheduleScript(postingPeriod,index)
{
	try{
		  
		var params = new Array();
		params['custscript_postingperiodfield'] = postingPeriod;
		params['custscript_indexfield']= index;
		 
        var status = nlapiScheduleScript('customscript_creditcardintercompanysch', 'customdeploy_creditcardintercompanysch',params);
        nlapiLogExecution('DEBUG', 'Script rescheduled', 'status: ' + status);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func rescheduleScript',ex.toString());
	}
}
