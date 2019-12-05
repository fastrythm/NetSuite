
function main(req, res){
	try{
		if(req.getMethod()==='POST')
		{
			 
			handlePostRequest(req,res);
			//handleGetRequest(req,res);
		}else{
			handleGetRequest(req,res);
		}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func main in CreditCard_IntercompanyJournal_Suitelet.js file',ex.toString());
	}
}



function handleGetRequest(req,res){
	try{
	 
		var filterObj = {};
		postingperiodParameter =  req.getParameter('pp');
		 
	 
		var rows = [];
		
		 
		
		
		 var form = nlapiCreateForm('Credit Card Inter Company Journal');
		 form.setScript('customscript_creditcardintercompany_clie');	
	
		 form.addButton('custpage_btngetdetails','Get Credit Card Journal','getCreditCardJournalDetails();');
		
		 var myselectfield = form.addField('custpage_postingperiodfield', 'select', 'Select Accounting Period');
		 createPostingPeriodDropDown(myselectfield,postingperiodParameter);
		
		 form.addSubmitButton('Submit');
		if(postingperiodParameter != null && postingperiodParameter != '')
		{
			myselectfield.setDefaultValue(postingperiodParameter);
			
			var records = getFilterCreditCardByPostingPeriodId(postingperiodParameter);
			
			if(records != null)
				{
			
			nlapiLogExecution('DEBUG','Total CreditCard Records',records.length);
			
					if(records && records.length>0){
						for(var i=0;i<records.length;i++){
							rows.push({	
								custpage_record_id : records[i].getId(),
								custpage_creditcardaccount : records[i].getText('custrecord_creditcardid'),
								custpage_postingperiod : records[i].getText('custrecord_creditcardpostingperiod'),
								custpage_subsidiary : records[i].getText('custrecord_creditcardsubsidiary'),
								custpage_amount : records[i].getValue('custrecord_creditcardamount'),
								custpage_journal_id : records[i].getText('custrecord_advanceintercompanyjournal'),			
								 
							});
						}
					}
				}
		}
		
		var list = form.addSubList('creditcardjournal', 'list', 'Credit Card Intercompany Journal');
		
		list.addField('custpage_record_id','text','Id').setDisplayType('hidden');
		list.addField('custpage_creditcardaccount','text','Credit Card Account').setDisplayType('disabled');
		list.addField('custpage_postingperiod','text','Period').setDisplayType('disabled');
		list.addField('custpage_subsidiary','text','Subsidiary').setDisplayType('disabled');
		list.addField('custpage_amount','text','Amount').setDisplayType('disabled');
		list.addField('custpage_journal_id','text','Advance Intercomp. Journal').setDisplayType('disabled');
	 
	 	list.setLineItemValues(rows);
		 
		
	 	
	 	res.writePage(form);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handleGetRequest',ex.toString());
	}
}

function getFilterCreditCardByPostingPeriodId(postingperiodParameter)
{
	try{
		 
		var postingPeriod = postingperiodParameter.split('__');
		
			var fils = new Array();
            var cols = new Array();
            cols.push(new nlobjSearchColumn('custrecord_creditcardid'));
			cols.push(new nlobjSearchColumn('custrecord_creditcardsubsidiary'));
			cols.push(new nlobjSearchColumn('custrecord_creditcardpostingperiod'));
			cols.push(new nlobjSearchColumn('custrecord_creditcardamount'));
			cols.push(new nlobjSearchColumn('custrecord_advanceintercompanyjournal'));
            
            fils.push(new nlobjSearchFilter('custrecord_creditcardpostingperiod',null,'is',postingPeriod[0]));
            var searchResults = nlapiSearchRecord('customrecord_creditcardjournalmapping', null, fils, cols);		
			
			
		return searchResults;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func getFilterCreditCardByPostingPeriodId',ex.toString());
	}
}

function createPostingPeriodDropDown(myselectfield,postingperiod)
{
	var cols = new Array();
 
	 cols.push(new nlobjSearchColumn('periodname'));
     cols.push(new nlobjSearchColumn('enddate'));
    var search = nlapiLoadSearch('accountingperiod','customsearch_cppaccountingperiod',null,null,cols);
   
    
    var res = search.runSearch();
	var results = res.getResults(0,1000);
	
	for(var i=0;i<results.length;i++)
	{
		var id = results[i].getId();
		var name = results[i].getValue('periodname');
		var enddate = results[i].getValue('enddate');
		var value = id+'__'+ enddate; 
		myselectfield.addSelectOption(value, name); 
		
		 
	}
}

// Schedule Script
function handlePostRequest(req,res)
{
	try{
		  var postingperiodfield   = req.getParameter("custpage_postingperiodfield");
		var params = new Array();
		params['custscript_postingperiodfield'] = postingperiodfield;
		params['custscript_indexfield'] = 0;
		 
        var status = nlapiScheduleScript('customscript_creditcardintercompanysch', 'customdeploy_creditcardintercompanysch',params);
        nlapiLogExecution('DEBUG', 'Script rescheduled', 'status: ' + status);
        
     
        res.sendRedirect('SUITELET', 'customscript_creditcardintercompanyjouna', 'customdeploy_creditcardintercompanyjouna', null, null);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handlePostRequest',ex.toString());
	}
}	

// Manual Script
/*
function handlePostRequest(req,res)
{
	try{
	 
	    
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
          
          for ( var i = 0; i < searchResults.length; i++ )
		  {
        	  var searchresult = searchResults[i];
        	   var creditCardAccountId = searchresult.getValue(creditCardAccount);
			   var creditCardSubsidiaryId = searchresult.getValue(creditCardSubsidiary);
			   var ccpCreditCardAccountId = searchresult.getValue(ccpCreditCardAccount);
			   var cppCreditCardSubsidiaryId = searchresult.getValue(cppCreditCardSubsidiary);
			   var creditDueFromAccountId = searchresult.getValue(creditDueFromAccount);
			   var creditCardDueToAccountId = searchresult.getValue(creditCardDueToAccount);
			   
			   
			    
			   var accountingPeriod = null;
			   var postingperiodfield   = req.getParameter("custpage_postingperiodfield");
			   nlapiLogExecution('DEBUG','postingperiodfield',postingperiodfield);
			   
			   if(postingperiodfield != null && postingperiodfield != '')
			   {
				   var parameters = postingperiodfield.split("__");
					 var postingId = parameters[0];
					 var endDate = parameters[1];
			          var amount = getAmountFromCreditCardTransaction(creditCardAccountId,creditCardSubsidiaryId,postingId);
			     
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
			    	 }
			   }
			
		  }
        
          res.sendRedirect('SUITELET', 'customscript_creditcardintercompanyjouna', 'customdeploy_creditcardintercompanyjouna', null, null);
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
	 	search.addColumn(amount);
	 
		var res = search.runSearch();
		var results = res.getResults(0,1000);
		
		var creditCardAmount = 0;
		nlapiLogExecution('DEBUG','CPP_Credit Card Transactions total records ',results.length);
		
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
*/
