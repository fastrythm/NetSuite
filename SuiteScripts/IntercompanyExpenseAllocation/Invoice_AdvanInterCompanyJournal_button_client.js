/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 August 2019     sohail.ahmed
 *
 */

function onClickInvoiceButton()
{
 	var subsidiaryId = nlapiGetFieldValue('subsidiary');
 	
 	var recordId = nlapiGetRecordId();
    var recordType = nlapiGetRecordType();
    var invoiceRecord = nlapiLoadRecord(recordType,recordId);
    var itemCount = invoiceRecord.getLineItemCount('item');
    var trandate =   invoiceRecord.getFieldValue('trandate');
   // var advanceintercompanyjournalid = invoiceRecord.getFieldValue('custbody_advanceintercompanyjournalid');	
    
 	nlapiLogExecution('DEBUG','subsidiary',subsidiaryId);
 	nlapiLogExecution('DEBUG','recordId',recordId);
	nlapiLogExecution('DEBUG','itemCount',itemCount);
 	nlapiLogExecution('DEBUG','tranDate',trandate);
	//nlapiLogExecution('DEBUG','advanceintercompanyjournalid',advanceintercompanyjournalid);
	
	
 	if(parseInt(itemCount) > 0)
    {
 	
 		 var fils = new Array();
         var cols = new Array();
         cols.push(new nlobjSearchColumn('custrecord_invoicejournal_subsidiary'));
		 cols.push(new nlobjSearchColumn('custrecord_invoicejournal_invoicedate'));
		 cols.push(new nlobjSearchColumn('custrecord_invoicejournal_invoiceid'));
		 cols.push(new nlobjSearchColumn('custrecord_invoicejournal_journalid'));
		 
     
        fils.push(new nlobjSearchFilter('custrecord_invoicejournal_invoiceid',null,'is',recordId));
        var searchResults = nlapiSearchRecord('customrecord_invoice_journal_mapping', null, fils, cols);
        var invoiceJournalMappingId = 0;
        	
        if(searchResults && searchResults.length > 0)
 	    {
            var  advanceintercompanyjournalid = searchResults[0].getValue('custrecord_invoicejournal_journalid');
            invoiceJournalMappingId = searchResults[0].getId();
            if(advanceintercompanyjournalid != null && advanceintercompanyjournalid != '')
            	{
		            nlapiDeleteRecord('advintercompanyjournalentry', advanceintercompanyjournalid);
            	}
 	    }
 	 	UpdateInvoiceAdvanceInterCompanyJournal(itemCount,invoiceRecord,subsidiaryId,trandate,recordId,invoiceJournalMappingId);
    }
 	else
	{
 		alert('No items found in invoice.');
	}
}





function RemoveAdvanceJournalLineItem(journalRecord)
{	try{
		 	var journalItemCount = journalRecord.getLineItemCount('line');
			for(var i=1;i<=journalItemCount;i++)
			{
				journalRecord.removeLineItem('line','1');
			}
			 
     }
	 catch(ex){
			nlapiLogExecution('ERROR','error in func RemoveAdvanceJournalLineItem',ex.message);
		}
}

function round(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function UpdateInvoiceAdvanceInterCompanyJournal(itemCount,invoiceRecords,subsidiaryId,tranDate,recordId,invoiceJournalMappingId)
{
	
	try{
		
		var record = null;
		record = nlapiCreateRecord('advintercompanyjournalentry');
	 
		
		record.setFieldValue('subsidiary', subsidiaryId);
		record.setFieldValue('trandate', tranDate);
		record.setFieldValue('custbody_transactiondocumentnumber', recordId); 
		 
	    var totalRevenue = 0;
	    var totalCogs = 0;
	   
	   	var subsidiary = new nlobjSearchColumn('subsidiary', null, 'group');
	 	var postingperiod = new nlobjSearchColumn('postingperiod', null, 'group');
	 	var custcol_gpharmacies = new nlobjSearchColumn('custcol_gpharmacies', null, 'group');
	 	var amount = new nlobjSearchColumn('amount', null, 'sum');
	 	var cogs = new nlobjSearchColumn('cogsamount', null, 'sum');
	 	var gPharmacyInternalId = new nlobjSearchColumn('custcol_subsidiaries', null, 'group'); 
 	
	 	var invoiceResults =  GetAllRevenuesAndCogsByInvoiceId(recordId,subsidiary,postingperiod,custcol_gpharmacies,amount,cogs,gPharmacyInternalId);
	 	var totalRevenueAmount = 0;
	 	var totalCogsAmount = 0;
	 	
	 	var itemRevenueAccountId = 1442;
	 	var itemCogsAccountId = 1441;
	 	
	 	var totalSabziRevenueAmount = 0;
	 	var totalSabziCogsAmount = 0;
	 	
		for(var i=0;i<invoiceResults.length;i++)
		{
			var lineSubsidiaryId = invoiceResults[i].getValue(subsidiary);
			var linePostingPeriod = invoiceResults[i].getValue(postingperiod);
			var gpharmaciesId = invoiceResults[i].getValue(custcol_gpharmacies);
			var revenueAmount = round(parseFloat(invoiceResults[i].getValue(amount)));
			var cogsAmount = round(parseFloat(invoiceResults[i].getValue(cogs)));
		
			if(gpharmaciesId != '' && gpharmaciesId != null)
			{
				
				totalRevenueAmount = round(totalRevenueAmount + revenueAmount);
				totalCogsAmount    = round(totalCogsAmount + cogsAmount);
				
				
					
				nlapiLogExecution('DEBUG','SearchResults','SubsidiaryId :'+ lineSubsidiaryId +', PostingPeriod :'+linePostingPeriod+', gPharmacyId :'+ gpharmaciesId +', revenueAmount :' + revenueAmount+', cogsAmount :'+cogsAmount);
				
				if(gpharmaciesId == 3 || gpharmaciesId == 4)
				{
					totalSabziRevenueAmount = round(totalSabziRevenueAmount + revenueAmount);
					totalSabziCogsAmount    = round(totalSabziCogsAmount + cogsAmount);
				}
			}
		}
		
		   nlapiLogExecution('DEBUG','Total Revenue Amount',   totalRevenueAmount);
	 	   nlapiLogExecution('DEBUG','Total Cogs Amount'   ,   totalCogsAmount);
	 	
		   
		   record.selectNewLineItem('line');
           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
           record.setCurrentLineItemValue('line', 'account', itemRevenueAccountId);
           record.setCurrentLineItemValue('line', 'debit', totalRevenueAmount);
           
           record.commitLineItem('line');
           nlapiLogExecution('DEBUG','Statement','Line Revenue : LineSubsidiary ' + subsidiaryId + ', Account '+ itemRevenueAccountId + ', Debited Amount '+ totalRevenueAmount); 
           
	 	
           record.selectNewLineItem('line');
           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
           record.setCurrentLineItemValue('line', 'account', itemCogsAccountId);
           record.setCurrentLineItemValue('line', 'credit', totalCogsAmount);
           record.commitLineItem('line');
           nlapiLogExecution('DEBUG','Statement','Line Cogs : LineSubsidiary ' + subsidiaryId + ', Account '+ itemCogsAccountId + ', Credited Amount '+ totalCogsAmount);
           
           for(var i=0;i<invoiceResults.length;i++)
   		   {
        	    var lineSubsidiaryId = invoiceResults[i].getValue(subsidiary);
				var linePostingPeriod = invoiceResults[i].getValue(postingperiod);
				var gpharmaciesId = invoiceResults[i].getValue(custcol_gpharmacies);
				var revenueAmount = round(parseFloat(invoiceResults[i].getValue(amount)));
				var cogsAmount = round(parseFloat(invoiceResults[i].getValue(cogs)));
				var gpharmacyInternalId =  invoiceResults[i].getValue(gPharmacyInternalId);  
			   
				var lineAmount = round(revenueAmount - cogsAmount);
        	     
	   			if(gpharmaciesId != '' && gpharmaciesId != null && gpharmaciesId != "4")
	   			{
	   				var results ;
	   				
	   				if(gpharmaciesId == "3")
	   				{
	   				   results  = 	GetDueToFromSubsidiaryAccounts(gpharmacyInternalId);
	   				   var sabziAmount = round(totalSabziRevenueAmount - totalSabziCogsAmount);
	   				   var dueToAccountId  = results[0].getValue('custrecord_dueto');
	   				   var dueToFromSubsidiaryId = results[0].getValue('custrecord_subsidiary');
	   				   record.selectNewLineItem('line');
		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
		   	           record.setCurrentLineItemValue('line', 'account', dueToAccountId);
		   	           record.setCurrentLineItemValue('line', 'credit', sabziAmount );
		   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
		   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', dueToFromSubsidiaryId); 
		   	           record.commitLineItem('line');
		   	           
	   	                nlapiLogExecution('DEBUG','Statement','Line Due To : LineSubsidiary ' + subsidiaryId + ', Account '+ dueToAccountId + ', Credited Amount '+ sabziAmount +', DueToFromSubsidiary ' + dueToFromSubsidiaryId);
	   					
	   				}
	   				else  
	   				{
	   				  
	   				   results = GetDueToFromSubsidiaryAccounts(gpharmacyInternalId);
	   				   var dueToAccountId  = results[0].getValue('custrecord_dueto');
	   				   var dueToFromSubsidiaryId = results[0].getValue('custrecord_subsidiary');
	   				   
	   				   record.selectNewLineItem('line');
		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
		   	           record.setCurrentLineItemValue('line', 'account', dueToAccountId);
		   	           record.setCurrentLineItemValue('line', 'credit', lineAmount);
		   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
		   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', dueToFromSubsidiaryId); 
		   	           record.commitLineItem('line');
		   	           
	   	                nlapiLogExecution('DEBUG','Statement','Line Due To : LineSubsidiary ' + subsidiaryId + ', Account '+ dueToAccountId + ', Credited Amount '+ lineAmount+', DueToFromSubsidiary ' + dueToFromSubsidiaryId);
	   	           
	   				}
	   				 
	   				
	   			}
   		   }
           
           var dueFromSubsidiaryResults = GetDueToFromSubsidiaryAccounts(subsidiaryId); 
	    
           for(var i=0;i<invoiceResults.length;i++)
   		   {
        	   // var lineSubsidiaryId = results[i].getValue(subsidiary);
				var linePostingPeriod = invoiceResults[i].getValue(postingperiod);
				var gpharmaciesId = invoiceResults[i].getValue(custcol_gpharmacies);
				var revenueAmount = round(parseFloat(invoiceResults[i].getValue(amount)));
				var cogsAmount = round(parseFloat(invoiceResults[i].getValue(cogs)));
				var gpharmacyInternalId =  invoiceResults[i].getValue(gPharmacyInternalId);
				
				var lineAmount = round(revenueAmount - cogsAmount);
        	     
	   			if(gpharmaciesId != '' && gpharmaciesId != null && gpharmaciesId != "4")
	   			{
	   				var results ;
	   				if(gpharmaciesId == "3")
	   				{
		   				  results = GetDueToFromSubsidiaryAccounts(gpharmacyInternalId);
		   			 	  
		   				  var dueFormAccountId  = results[0].getValue('custrecord_dueto');
		   				  var lineSubsidiaryId = results[0].getValue('custrecord_subsidiary');
		   				  
			   			   record.selectNewLineItem('line');
			   	           record.setCurrentLineItemValue('line', 'linesubsidiary', lineSubsidiaryId);
			   	           record.setCurrentLineItemValue('line', 'account', itemRevenueAccountId);
			   	           record.setCurrentLineItemValue('line', 'credit', totalSabziRevenueAmount);
			   	           record.setCurrentLineItemValue('line', 'custcol_apharmacies', subsidiaryId);
			   	          
			   	           record.commitLineItem('line');
			   	           nlapiLogExecution('DEBUG','Statement','Line Revenue : LineSubsidiary ' + lineSubsidiaryId + ', Account '+ itemRevenueAccountId + ', Credited Amount '+ totalSabziRevenueAmount+', DueToFromSubsidiary '); 
			   	           
			   		 	
			   	           record.selectNewLineItem('line');
			   	           record.setCurrentLineItemValue('line', 'linesubsidiary', lineSubsidiaryId);
			   	           record.setCurrentLineItemValue('line', 'account', itemCogsAccountId);
			   	           record.setCurrentLineItemValue('line', 'debit', totalSabziCogsAmount);
			   	           record.setCurrentLineItemValue('line', 'custcol_apharmacies', subsidiaryId);  
			   	           record.commitLineItem('line');
			   	           nlapiLogExecution('DEBUG','Statement','Line Cogs : LineSubsidiary ' + lineSubsidiaryId + ', Account '+ itemCogsAccountId + ', Debited Amount '+ totalSabziCogsAmount+', DueToFromSubsidiary ' );
			   	         
			   	           var sabziAmount = round(totalSabziRevenueAmount - totalSabziCogsAmount);
			   	        
		   				   record.selectNewLineItem('line');
			   	           record.setCurrentLineItemValue('line', 'linesubsidiary', lineSubsidiaryId);
			   	           record.setCurrentLineItemValue('line', 'account', dueFromSubsidiaryResults[0].getValue('custrecord_duefrom'));
			   	           record.setCurrentLineItemValue('line', 'debit', sabziAmount);
			   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
			   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', subsidiaryId); 
			   	           record.commitLineItem('line');
			   	           nlapiLogExecution('DEBUG','Statement','Line Due From : LineSubsidiary ' + lineSubsidiaryId + ', Account '+ dueFromSubsidiaryResults[0].getValue('custrecord_dueto') + ', Debited Amount '+ sabziAmount +', DueToFromSubsidiary ' + subsidiaryId);
		   	           
		   				}
	   				else
	   				{
	   				  results = GetDueToFromSubsidiaryAccounts(gpharmacyInternalId);
	   				  
	   				  var dueFormAccountId  = results[0].getValue('custrecord_dueto');
	   				  var lineSubsidiaryId = results[0].getValue('custrecord_subsidiary');
	   				  
		   			   record.selectNewLineItem('line');
		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', lineSubsidiaryId);
		   	           record.setCurrentLineItemValue('line', 'account', itemRevenueAccountId);
		   	           record.setCurrentLineItemValue('line', 'credit', revenueAmount);
		   	           record.setCurrentLineItemValue('line', 'custcol_apharmacies', subsidiaryId);  
		   	           record.commitLineItem('line');
		   	           nlapiLogExecution('DEBUG','Statement','Line Revenue : LineSubsidiary ' + lineSubsidiaryId + ', Account '+ itemRevenueAccountId + ', Credited Amount '+ revenueAmount+', DueToFromSubsidiary ' ); 
		   	           
		   		 	
		   	           record.selectNewLineItem('line');
		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', lineSubsidiaryId);
		   	           record.setCurrentLineItemValue('line', 'account', itemCogsAccountId);
		   	           record.setCurrentLineItemValue('line', 'debit', cogsAmount);
		   	           record.setCurrentLineItemValue('line', 'custcol_apharmacies', subsidiaryId);  
		   	           record.commitLineItem('line');
		   	           nlapiLogExecution('DEBUG','Statement','Line Cogs : LineSubsidiary ' + lineSubsidiaryId + ', Account '+ itemCogsAccountId + ', Debited Amount '+ cogsAmount+', DueToFromSubsidiary ');
		   	         
	   				   record.selectNewLineItem('line');
		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', lineSubsidiaryId);
		   	           record.setCurrentLineItemValue('line', 'account', dueFromSubsidiaryResults[0].getValue('custrecord_duefrom'));
		   	           record.setCurrentLineItemValue('line', 'debit', lineAmount);
		   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
		   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', subsidiaryId); 
		   	           record.commitLineItem('line');
		   	           nlapiLogExecution('DEBUG','Statement','Line Due From : LineSubsidiary ' + lineSubsidiaryId + ', Account '+ dueToAccountId + ', Debited Amount '+ lineAmount+', DueToFromSubsidiary ' + subsidiaryId);
	   	           
	   				}
	   				 
	   			
	   			}
	   		}
           
           
           var advintercompanyjournalentryId =  nlapiSubmitRecord(record);
           nlapiLogExecution('DEBUG','advintercompanyjournalentryId',advintercompanyjournalentryId);
         
           
        
           
 
	           var customRecord_invoiceJournal = null;
	           if(invoiceJournalMappingId != 0)
        	   {
            	   customRecord_invoiceJournal = nlapiLoadRecord('customrecord_invoice_journal_mapping',invoiceJournalMappingId); 
            	  
        	   }
               else
        	   {
            	   customRecord_invoiceJournal =  nlapiCreateRecord('customrecord_invoice_journal_mapping');
        	   }
           
	          
	           customRecord_invoiceJournal.setFieldValue('custrecord_invoicejournal_subsidiary',subsidiaryId);
	           customRecord_invoiceJournal.setFieldValue('custrecord_invoicejournal_invoicedate',tranDate);
	           customRecord_invoiceJournal.setFieldValue('custrecord_invoicejournal_invoiceid',recordId);
	           customRecord_invoiceJournal.setFieldValue('custrecord_invoicejournal_journalid',advintercompanyjournalentryId);
	           
               nlapiSubmitRecord(customRecord_invoiceJournal);
               
           window.location.reload(true);
           
	   }
	   catch(ex){
			nlapiLogExecution('ERROR','error in func UpdateInvoiceAdvanceInterCompanyJournal',ex.message);
		  
		}
}


function GetAllRevenuesAndCogsByInvoiceId(invoiceId,subsidiary,postingperiod,custcol_gpharmacies,amount,cogs,gPharmacyInternalId)
{
	try{
			var fils = new Array();
		    var search = nlapiLoadSearch('transaction','customsearch_apharmaciesrevenue');
		    fils.push(new nlobjSearchFilter('internalid',null,'is',invoiceId));
		  	search.addFilters(fils);
		 	
		 	search.addColumn(subsidiary);
		 	search.addColumn(postingperiod);
			search.addColumn(custcol_gpharmacies);
			search.addColumn(amount);
			search.addColumn(cogs);
			search.addColumn(gPharmacyInternalId); 
			
			var res = search.runSearch();
			var results = res.getResults(0,1000);
			
			return results;
	 }
    catch(ex){
		nlapiLogExecution('ERROR','error in func GetAllRevenuesAndCogsByInvoiceId',ex.message);
	}
}

 

function GetDueToFromSubsidiaryAccounts(subsidiaryInternalId)
{
    
 	var fils = new Array();
    var cols = new Array();
    cols.push(new nlobjSearchColumn('custrecord_subsidiary'));
	cols.push(new nlobjSearchColumn('custrecord_duefrom'));
	cols.push(new nlobjSearchColumn('custrecord_dueto'));
	cols.push(new nlobjSearchColumn('custrecord_avgdisincome'));
	cols.push(new nlobjSearchColumn('custrecord_10avgdisincome'));
	cols.push(new nlobjSearchColumn('custrecord_avgdisexpense'));
	cols.push(new nlobjSearchColumn('custrecord_10avgdisexpense'));
	
	

    fils.push(new nlobjSearchFilter('custrecord_subsidiary',null,'is',subsidiaryInternalId));
    var searchResults = nlapiSearchRecord('customrecord_intercompany_accountmapping', null, fils, cols);
    //nlapiLogExecution('DEBUG','Intercompany Accounts Mapping Total Records',searchResults.length);
    
    return searchResults;
}


function onClickADIAButton()
{
		try{
			
			var subsidiaryId = nlapiGetFieldValue('subsidiary');
		 	
		 	var recordId = nlapiGetRecordId();
		    var recordType = nlapiGetRecordType();
		    var invoiceRecord = nlapiLoadRecord(recordType,recordId);
		    
		    var itemCount = invoiceRecord.getLineItemCount('item');
		    var trandate =   invoiceRecord.getFieldValue('trandate');
		    var postingperiod =   invoiceRecord.getFieldValue('postingperiod');
		    
		 	nlapiLogExecution('DEBUG','subsidiary',subsidiaryId);
		 	nlapiLogExecution('DEBUG','recordId',recordId);
			nlapiLogExecution('DEBUG','itemCount',itemCount);
		 	nlapiLogExecution('DEBUG','tranDate',trandate);
		 	nlapiLogExecution('DEBUG','postingperiod',postingperiod);
			
		 	if(parseInt(itemCount) > 0)
		    {
		 	
		 		 var fils = new Array();
		         var cols = new Array();
		         cols.push(new nlobjSearchColumn('custrecord_invoicejournal_subsidiary'));
				 cols.push(new nlobjSearchColumn('custrecord_invoicejournal_invoicedate'));
				 cols.push(new nlobjSearchColumn('custrecord_invoicejournal_invoiceid'));
				 cols.push(new nlobjSearchColumn('custrecord_invoicejournal_journalid'));
				 cols.push(new nlobjSearchColumn('custrecord_adiadvanceintercompanyjournal'));
		     
		        fils.push(new nlobjSearchFilter('custrecord_invoicejournal_invoiceid',null,'is',recordId));
		        var searchResults = nlapiSearchRecord('customrecord_invoice_journal_mapping', null, fils, cols);
		        var invoiceJournalMappingId = 0;
		        	
		        if(searchResults && searchResults.length > 0)
		 	    {
		            var  adiadvanceintercompanyjournal = searchResults[0].getValue('custrecord_adiadvanceintercompanyjournal');
		            invoiceJournalMappingId = searchResults[0].getId();
		            
		            if(adiadvanceintercompanyjournal != null && adiadvanceintercompanyjournal != '')
	            	{
		             	nlapiDeleteRecord('advintercompanyjournalentry', adiadvanceintercompanyjournal);
	            	}
			    	 
		 	    }
		 	 	UpdateADIInvoiceAdvanceInterCompanyJournal(itemCount,invoiceRecord,subsidiaryId,trandate,recordId,invoiceJournalMappingId,postingperiod);
		    }
		 	else
			{
		 		alert('No items found in invoice.');
			}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func onClickADIAButton',ex.message);
	}
}



function UpdateADIInvoiceAdvanceInterCompanyJournal(itemCount,invoiceRecords,subsidiaryId,tranDate,recordId,invoiceJournalMappingId,postingperiodId)
{
	
	try{
		
		var record = null;
		record = nlapiCreateRecord('advintercompanyjournalentry');
	 
		
		record.setFieldValue('subsidiary', subsidiaryId);
		record.setFieldValue('trandate', tranDate);
		record.setFieldValue('custbody_transactiondocumentnumber', recordId); 
		 
		
	 	var subsidiary = new nlobjSearchColumn('subsidiary', null, 'group');
	 	var postingperiod = new nlobjSearchColumn('postingperiod', null, 'group');
	 	var amount = new nlobjSearchColumn('amount', null, 'sum');
	 	
         var totalExpenseRecord = getTotalExpensesByPeriodAndSubsidiary(postingperiodId,subsidiaryId,subsidiary,postingperiod,amount) ;
           
         
             if(totalExpenseRecord != null && totalExpenseRecord.length > 0)
        	 {
        	 
        		var totalExpenseAmount = round(parseFloat(totalExpenseRecord[0].getValue(amount)));
                if(totalExpenseAmount > 0)
                 {
                	
                	  var interCompanyAccountMapping = GetDueToFromSubsidiaryAccounts(subsidiaryId); 
                	  
                	   var AvgIncomeAccountId  = interCompanyAccountMapping[0].getValue('custrecord_avgdisincome');
	   				   var Avg10DisIncomeAccountId = interCompanyAccountMapping[0].getValue('custrecord_10avgdisincome');
	   				   var  parentSubsidiaryDueToAccountId = interCompanyAccountMapping[0].getValue('custrecord_dueto');  
	   				   
	   				 var custcol_gpharmacies = new nlobjSearchColumn('custcol_gpharmacies', null, 'group');
		   		 	 var lineUniqueKeyCountColumn = new nlobjSearchColumn('lineuniquekey', null, 'count');
		   		 	 var gPharmacyInternalColumn = new nlobjSearchColumn('custcol_subsidiaries', null, 'group'); 
		   		 	
	   	              var totalLineItemResults =  getTotalLineItemsoCountByInvoiceId(recordId,lineUniqueKeyCountColumn,custcol_gpharmacies,gPharmacyInternalColumn)
	   	           
	   	             if(totalLineItemResults == null)
	   	            	  return;
	   	              
		   	           var totalLineItemCount = getTotalLineItemCount(totalLineItemResults,lineUniqueKeyCountColumn);
              	    
		   	         for(var i=0;i<totalLineItemResults.length ;i++)
             	     {
		   	        	 
		   	        	var gpharmaciesId = totalLineItemResults[i].getValue(custcol_gpharmacies);
                		var gpharmaciesInternalId = totalLineItemResults[i].getValue(gPharmacyInternalColumn);
            			var lineItemCountPerGPharmacy = totalLineItemResults[i].getValue(lineUniqueKeyCountColumn);
            			 
            			if(gpharmaciesId != '' && gpharmaciesId != null)
            			{
            				  var gpharmacyAccountMapping = GetDueToFromSubsidiaryAccounts(gpharmaciesInternalId); 
                          	
            				  var dueFormAccountId  = gpharmacyAccountMapping[0].getValue('custrecord_duefrom');
            				  var calculatedAmount = round((totalExpenseAmount / totalLineItemCount) * lineItemCountPerGPharmacy);
            			 
            				   record.selectNewLineItem('line');
				   	           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
				   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', gpharmaciesInternalId);
				   	           record.setCurrentLineItemValue('line', 'account', AvgIncomeAccountId);
				   	           record.setCurrentLineItemValue('line', 'credit', calculatedAmount);
				   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
				   	           record.commitLineItem('line');
				   	           
				   	           nlapiLogExecution('DEBUG','Statement','LineSubsidiary ' + subsidiaryId + ', Account '+ AvgIncomeAccountId + ', Credited Amount : '+ calculatedAmount + ', Elimination : T' + ', DueToFromSubsidiary : '+ gpharmaciesInternalId ); 
				   	           
			   				   
				   	           var tenPercentAmount = round((calculatedAmount / 100)  * 10);
				   	           
				   	           record.selectNewLineItem('line');
				   	           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
				   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', gpharmaciesInternalId);
				   	           record.setCurrentLineItemValue('line', 'account', Avg10DisIncomeAccountId);
				   	           record.setCurrentLineItemValue('line', 'credit', tenPercentAmount);
				   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
				   	           record.commitLineItem('line');
				   	           
				   	           nlapiLogExecution('DEBUG','Statement','LineSubsidiary ' + subsidiaryId + ', Account '+ Avg10DisIncomeAccountId + ', Credited Amount 10 % : '+ tenPercentAmount + ', Elimination : T' + ', DueToFromSubsidiary : '+ gpharmaciesInternalId ); 
				   	           
				   	  	  
				   	           var totalIncome =   round(calculatedAmount + tenPercentAmount)  ;
				   	        
                			   record.selectNewLineItem('line');
           		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
           		   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', gpharmaciesInternalId);
           		   	           record.setCurrentLineItemValue('line', 'account', dueFormAccountId);
           		   	           record.setCurrentLineItemValue('line', 'debit', totalIncome);
           		   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
           		   	           record.commitLineItem('line');
           		   	           
           		   	           nlapiLogExecution('DEBUG','Statement','LineSubsidiary ' + subsidiaryId + ', Account '+ dueFormAccountId + ', Debited Amount '+ totalIncome + ', Elimination : T' + ', DueToFromSubsidiary : '+ gpharmaciesInternalId); 
            			}
             	     }
		   	     	 
		   	            
		   	           
				   	        for(var i=0;i<totalLineItemResults.length ;i++)
		             	    {
				   	        	var gpharmaciesId = totalLineItemResults[i].getValue(custcol_gpharmacies);
				   	         	var gpharmaciesInternalId = totalLineItemResults[i].getValue(gPharmacyInternalColumn);
	                		  	var lineItemCountPerGPharmacy =totalLineItemResults[i].getValue(lineUniqueKeyCountColumn);
	                			 
	                			if(gpharmaciesId != '' && gpharmaciesId != null)
	                			{
	                				  var gpharmacyAccountMapping = GetDueToFromSubsidiaryAccounts(gpharmaciesInternalId);
	                				  
	                				  var AvgExpenseAccountId  = gpharmacyAccountMapping[0].getValue('custrecord_avgdisexpense');
	           	   				      var Avg10DisExpenseAccountId = gpharmacyAccountMapping[0].getValue('custrecord_10avgdisexpense');
	           	   				      
	           	   				   
	           	   				   var expenseAmount = round((totalExpenseAmount / totalLineItemCount) * lineItemCountPerGPharmacy);
	           	   				   record.selectNewLineItem('line');
		       		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', gpharmaciesInternalId);
		       		   	           record.setCurrentLineItemValue('line', 'account', AvgExpenseAccountId);
		       		   	           record.setCurrentLineItemValue('line', 'debit', expenseAmount);
		       		   	           record.commitLineItem('line');
		       		   	           
		       		   	           nlapiLogExecution('DEBUG','Statement','LineSubsidiary ' + gpharmaciesInternalId + ', Account '+ AvgExpenseAccountId + ', Debited Amount : '+ expenseAmount );
		       		   	        
			       		   	       var expense10PercentAmount =   round(( expenseAmount / 100 ) * 10) ;
			       		   	       record.selectNewLineItem('line');
		       		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', gpharmaciesInternalId);
		       		   	           record.setCurrentLineItemValue('line', 'account', Avg10DisExpenseAccountId);
		       		   	           record.setCurrentLineItemValue('line', 'debit', expense10PercentAmount);
		       		   	           record.commitLineItem('line');
		       		   	           
		       		   	           nlapiLogExecution('DEBUG','Statement','LineSubsidiary ' + gpharmaciesInternalId + ', Account '+ Avg10DisExpenseAccountId + ', Debited Amount 10 % : '+ expense10PercentAmount );
	       		   	           
			       		   	     
		       		   	           var totalExpense =   round(expenseAmount + expense10PercentAmount)  ;
			       		   	       record.selectNewLineItem('line');
		       		   	           record.setCurrentLineItemValue('line', 'linesubsidiary', gpharmaciesInternalId);
		       		   	           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', subsidiaryId);
		       		   	           record.setCurrentLineItemValue('line', 'account', parentSubsidiaryDueToAccountId);
		       		   	           record.setCurrentLineItemValue('line', 'credit', totalExpense);
		       		   	           record.setCurrentLineItemValue('line', 'eliminate', 'T');
		       		   	           record.commitLineItem('line');
		       		   	           
		       		   	           nlapiLogExecution('DEBUG','Statement','LineSubsidiary ' + gpharmaciesInternalId + ', Account '+ parentSubsidiaryDueToAccountId + ', Credited Amount '+ totalExpense  + ', Elimination : T ' + ', DueToFromSubsidiary : '+ subsidiaryId);
	                			}
				   	        	
		             	    }
		   	           
		   	           
		   	           
				               var advintercompanyjournalentryId =  nlapiSubmitRecord(record);
				               nlapiLogExecution('DEBUG','advintercompanyjournalentryId',advintercompanyjournalentryId);
				     
					           var customRecord_invoiceJournal = null;
					           if(invoiceJournalMappingId != 0)
				        	   {
				            	   customRecord_invoiceJournal = nlapiLoadRecord('customrecord_invoice_journal_mapping',invoiceJournalMappingId); 
				            	  
				        	   }
				               else
				        	   {
				            	   customRecord_invoiceJournal =  nlapiCreateRecord('customrecord_invoice_journal_mapping');
				        	   }
				           
					          
					           customRecord_invoiceJournal.setFieldValue('custrecord_invoicejournal_subsidiary',subsidiaryId);
					           customRecord_invoiceJournal.setFieldValue('custrecord_invoicejournal_invoicedate',tranDate);
					           customRecord_invoiceJournal.setFieldValue('custrecord_invoicejournal_invoiceid',recordId);
					           customRecord_invoiceJournal.setFieldValue('custrecord_adiadvanceintercompanyjournal',advintercompanyjournalentryId);
					           
				               nlapiSubmitRecord(customRecord_invoiceJournal);
		               
                	}
           
      	 
        	 }
         window.location.reload(true);
           
	   }
	   catch(ex){
			nlapiLogExecution('ERROR','error in func UpdateADIInvoiceAdvanceInterCompanyJournal',ex.message);
		  
		}
}

function getTotalExpensesByPeriodAndSubsidiary(postingperiodId,subsidiaryId,subsidiary,postingperiod,amount)
{
		try{
			var fils = new Array();
		    var search = nlapiLoadSearch('transaction','customsearch_cpptotalexpense');
		    fils.push(new nlobjSearchFilter('postingperiod',null,'is',postingperiodId));
		    fils.push(new nlobjSearchFilter('subsidiary',null,'is',subsidiaryId));
		  	search.addFilters(fils);
		 	
		 	search.addColumn(subsidiary);
		 	search.addColumn(postingperiod);
			search.addColumn(amount);
		 
			
			var res = search.runSearch();
			var results = res.getResults(0,1000);
			
			return results;
	 }
	catch(ex){
		nlapiLogExecution('ERROR','error in func getTotalExpensesByPeriodAndSubsidiary',ex.message);
	}
}


function getTotalLineItemsoCountByInvoiceId(invoiceId,lineUniqueKeyCount,custcol_gpharmacies,gPharmacyInternalId)
{
		try{
			var fils = new Array();
		    var search = nlapiLoadSearch('transaction','customsearch_totallineitemcount');
		    fils.push(new nlobjSearchFilter('internalid',null,'is',invoiceId));
		  
		  	search.addFilters(fils);
		 	
		 	search.addColumn(custcol_gpharmacies);
		 	search.addColumn(lineUniqueKeyCount);
			search.addColumn(gPharmacyInternalId);
		 
			var res = search.runSearch();
			var results = res.getResults(0,1000);
			
			return results;
	 }
	catch(ex){
		nlapiLogExecution('ERROR','error in func getTotalLineItemsofSubsidiaryByInvoiceId',ex.message);
	}
}
 

function getTotalLineItemCount(totalLineItemResults,lineUniqueKeyCountColumn)
{
   
	 var count = 0;
			for(var i=0;i<totalLineItemResults.length ;i++)
			{
					 
					var lineItemCountPerGPharmacy = totalLineItemResults[i].getValue(lineUniqueKeyCountColumn);
					
					count = count + parseInt(lineItemCountPerGPharmacy);
			}
return count;
 }