function beforeSubmit(type){
	try{
		
     
       
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func beforeSubmit',ex.toString());
	}
}




function afterSubmit(type){
	try{
		 
		 
		 
			var subsidiaryId = nlapiGetFieldValue('subsidiary');
			var account = nlapiGetFieldValue('account');
			var trandate = nlapiGetFieldValue('trandate');
		 
			var payee = nlapiGetFieldValue('entity');
			 
			 var recordId = nlapiGetRecordId();
	       
			var itemCount = nlapiGetLineItemCount('expense');	
	        
			nlapiLogExecution('DEBUG','subsidiary',subsidiaryId);
			nlapiLogExecution('DEBUG','account',account);
			nlapiLogExecution('DEBUG','payee',payee);
			nlapiLogExecution('DEBUG','trandate',trandate);
			nlapiLogExecution('DEBUG','recordId',recordId);
			nlapiLogExecution('DEBUG','itemCount',itemCount);
			 
			
	        if(parseInt(itemCount) > 0)
	        {
	             		
			   AddUpdateCheckDeposit(subsidiaryId,account,trandate,recordId,itemCount,type);
	        	 
	        }
      
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func afterSubmit',ex.toString());
	}
}


function AddUpdateCheckDeposit(subsidiaryId,account,tranDate,recordId,itemCount,type)
{
	try{
		var depositRecord = null;
		var recordType = nlapiGetRecordType();
		var eliminationSubsidiary = 20;
		if(type == 'edit')
		{
			var checkRecord = nlapiLoadRecord(recordType,recordId); 
			var existingDepositId =  checkRecord.getFieldValue('custbody_bankdeposit');
			nlapiLogExecution('DEBUG','DepositId',existingDepositId);
			
		
			var eliminationTransactionJournalId =  checkRecord.getFieldValue('custbody_eliminatetransactionjournalid');
			
			
			nlapiLogExecution('DEBUG','EliminationTransactionJournalId',eliminationTransactionJournalId);
			
			if(existingDepositId != '' && existingDepositId != null)
        	{
				depositRecord = nlapiLoadRecord('deposit',existingDepositId);
				
				var depositItemCount = depositRecord.getLineItemCount('other');
				for(var i=1;i<=depositItemCount;i++)
				{
					depositRecord.removeLineItem('other','1');
				}
        	}
			else 
			{
				depositRecord =  nlapiCreateRecord('deposit');
			}
		}
		else if(type == 'create')
		{
		 	depositRecord =  nlapiCreateRecord('deposit');
		}
		
		depositRecord.setFieldValue('custbody_checknumber', recordId);
		depositRecord.setFieldValue('trandate', tranDate);
		
		depositRecord.setFieldValue('custbody_transferaccount', account);
		var transactionElimination = null;
		
		for(var j=1;j<=itemCount; j++)
        {
           var checkdueToFromAccount =  nlapiGetLineItemValue('expense', 'account', j);
           var checkExpenseAmount =  nlapiGetLineItemValue('expense', 'amount', j);
           var transferToAccount =  nlapiGetLineItemValue('expense', 'custcol_transferaccount', j);
            transactionElimination =  nlapiGetLineItemValue('expense', 'custcol_eliminationtransaction', j);
           
         
           depositRecord.setFieldValue('account', transferToAccount);
           depositRecord.setFieldValue('custbody_eliminatetransaction', transactionElimination);
           
           nlapiLogExecution('DEBUG','Check','Line Item : Due To And From AccountId ' + checkdueToFromAccount + ', Line Amount '+ checkExpenseAmount + ', Transfer To Account  '+ transferToAccount); 
 	         
           var accountMappingDetails =  GetDueToFromSubsidiaryAccounts(checkdueToFromAccount);
           
           if(accountMappingDetails == null)
        	   return;
           
           if(accountMappingDetails.length > 0)
    	   {
        	   var lineSubsidiary = accountMappingDetails[0].getValue('custrecord_subsidiary');
        	   var dueFromAccountId = accountMappingDetails[0].getValue('custrecord_duefrom');
        	   var dueToAccountId = accountMappingDetails[0].getValue('custrecord_dueto');
        	   
        	   nlapiLogExecution('DEBUG','Payee Account Detail ','Subsidiary  ' + lineSubsidiary + ', Due From Account '+ dueFromAccountId + ', Due To Account  '+ dueToAccountId); 
       	     
        	   
        	   depositRecord.setFieldValue('subsidiary', lineSubsidiary);
        	 
        	   depositRecord.selectNewLineItem('other');
        	 
        	   
        	   var transferingSubsidiary =  GetDueToFromDepositSubsidiaryAccount(subsidiaryId)
        	   
        	   var transferSubsidiary = transferingSubsidiary[0].getValue('custrecord_subsidiary');
        	   var transferdueFromAccountId = transferingSubsidiary[0].getValue('custrecord_duefrom');
        	   var transferdueToAccountId = transferingSubsidiary[0].getValue('custrecord_dueto');
        	   var customerId = transferingSubsidiary[0].getValue('custrecord_customer');
        	   depositRecord.setCurrentLineItemValue('other', 'entity', customerId);  
        		nlapiLogExecution('DEBUG','customerId',customerId);
        	   
        	   nlapiLogExecution('DEBUG','Transferer Account Detail ','Subsidiary  ' + transferSubsidiary + ', Due From Account '+ transferdueFromAccountId + ', Due To Account  '+ transferdueToAccountId); 
         	     
        	   
        	   if(checkdueToFromAccount == dueFromAccountId)
        		{
        		   depositRecord.setCurrentLineItemValue('other', 'account', transferdueToAccountId);
        	    }
        	    else  if(checkdueToFromAccount == dueToAccountId)
        		{
        	    	 depositRecord.setCurrentLineItemValue('other', 'account', transferdueFromAccountId);
        		}
        	   depositRecord.setCurrentLineItemValue('other', 'amount', checkExpenseAmount);
        	   depositRecord.commitLineItem('other');
    	   }
        }
		
		var depositId = nlapiSubmitRecord(depositRecord);
		
		nlapiLogExecution('DEBUG','Deposit Id ',depositId);
		
		var checkRecord = nlapiLoadRecord('check',recordId); 
		checkRecord.setFieldValue('custbody_bankdeposit', depositId);
		nlapiSubmitRecord(checkRecord);
		
		
		if(transactionElimination == 'T')
		{
			AddGeneralLedgerEntry(eliminationTransactionJournalId,recordId,eliminationSubsidiary,tranDate,checkdueToFromAccount,dueToAccountId,dueFromAccountId,transferdueToAccountId,transferdueFromAccountId,checkExpenseAmount);
		}
		
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func AddUpdateCheckDeposit',ex.toString());
	}
}


function GetDueToFromSubsidiaryAccounts(accountId)
{
    
 	var fils = new Array();
    var cols = new Array();
    cols.push(new nlobjSearchColumn('custrecord_subsidiary'));
	cols.push(new nlobjSearchColumn('custrecord_duefrom'));
	cols.push(new nlobjSearchColumn('custrecord_dueto'));
	cols.push(new nlobjSearchColumn('custrecord_customer'));
	
    var filterExpression =   [ [ 'custrecord_duefrom', 'is', accountId ],'or',[ 'custrecord_dueto', 'is', accountId ]] ;
    
    var searchResults = nlapiSearchRecord('customrecord_intercompany_accountmapping', null, filterExpression, cols);
 
    
    return searchResults;
}

function GetDueToFromDepositSubsidiaryAccount(subsidiaryId)
{
    
 	var fils = new Array();
    var cols = new Array();
    cols.push(new nlobjSearchColumn('custrecord_subsidiary'));
	cols.push(new nlobjSearchColumn('custrecord_duefrom'));
	cols.push(new nlobjSearchColumn('custrecord_dueto'));
	cols.push(new nlobjSearchColumn('custrecord_customer'));
	
    fils.push(new nlobjSearchFilter('custrecord_subsidiary',null,'is',subsidiaryId));
    
    
    var searchResults = nlapiSearchRecord('customrecord_intercompany_accountmapping', null, fils, cols);
 
    
    return searchResults;
}

function AddGeneralLedgerEntry(eliminationTransactionJournalId,recordId,eliminationSubsidiary,transDate,checkdueToFromAccount,dueToAccountId,dueFromAccountId,transferdueToAccountId,transferdueFromAccountId,checkExpenseAmount)
{
	try
	{
		 var record = null;
		  if(eliminationTransactionJournalId != null && eliminationTransactionJournalId != '')
		  {
			//  record = nlapiLoadRecord('journalentry',eliminationTransactionJournalId);
			//  record = RemoveJournalLineItem(record);
			  
			  nlapiDeleteRecord('journalentry', eliminationTransactionJournalId);
		  }
		 /* else
		  {
			  record = nlapiCreateRecord('journalentry');
		  }*/
		   record = nlapiCreateRecord('journalentry');
		   record.setFieldValue('subsidiary', eliminationSubsidiary);
		   record.setFieldValue('trandate', transDate);
		   record.setFieldValue('custbody_transactiondocumentnumber', recordId); 
		   
		   if(checkdueToFromAccount == dueFromAccountId)
   		   {
			   record.selectNewLineItem('line');
	           record.setCurrentLineItemValue('line', 'account', dueFromAccountId);
	           record.setCurrentLineItemValue('line', 'credit', checkExpenseAmount);
	           record.commitLineItem('line');
	           
	           record.selectNewLineItem('line');
	           record.setCurrentLineItemValue('line', 'account', transferdueToAccountId);
	           record.setCurrentLineItemValue('line', 'debit', checkExpenseAmount);
	           record.commitLineItem('line');
   		   }
		   else  if(checkdueToFromAccount == dueToAccountId)
		   	{
			   record.selectNewLineItem('line');
	           record.setCurrentLineItemValue('line', 'account', dueToAccountId);
	           record.setCurrentLineItemValue('line', 'debit', checkExpenseAmount);
	           record.commitLineItem('line');
	           
	           record.selectNewLineItem('line');
	           record.setCurrentLineItemValue('line', 'account', transferdueFromAccountId);
	           record.setCurrentLineItemValue('line', 'credit', checkExpenseAmount);
	           record.commitLineItem('line');	
		   	}
		     var journalentryId =  nlapiSubmitRecord(record);
		     nlapiLogExecution('DEBUG','Journal Entry Id ',journalentryId);
		     
		     if(journalentryId && journalentryId != null)
		    	 {
			 	 var recordType = nlapiGetRecordType();
			     var checkRecord = nlapiLoadRecord(recordType,recordId); 
			     checkRecord.setFieldValue('custbody_eliminatetransactionjournalid', journalentryId);
			     nlapiSubmitRecord(checkRecord);
		    	 }
			
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func AddGeneralLedgerEntry',ex.toString());
	}
}

function RemoveJournalLineItem(journalRecord)
{	try{
		 	var journalItemCount = journalRecord.getLineItemCount('line');
			for(var i=1;i<=journalItemCount;i++)
			{
				journalRecord.removeLineItem('line','1');
			}
		return  journalRecord;
     }
	 catch(ex){
			nlapiLogExecution('ERROR','error in func RemoveAdvanceJournalLineItem',ex.message);
		}
}