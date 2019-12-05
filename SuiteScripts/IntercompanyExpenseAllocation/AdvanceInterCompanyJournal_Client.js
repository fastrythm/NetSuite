function onClickInterCompanyAllocationButton()
{
	
	try{
		 
		   var context = nlapiGetContext();
			var user = context.getUser();
			
			var recordId = nlapiGetRecordId();
		    var recordType = nlapiGetRecordType();
		    var billRecord = nlapiLoadRecord(recordType,recordId);
			
			var subsidiaryId = nlapiGetFieldValue('subsidiary');
			var totalAmount = nlapiGetFieldValue('total');
			var vendorId = billRecord.getFieldValue('entity');
			var advanceintercompanyjournalid = billRecord.getFieldValue('custbody_advanceintercompanyjournalid');	
			var trandate = billRecord.getFieldValue('trandate');
			var approvalstatus = billRecord.getFieldValue('approvalstatus');
			 
	        var vendorRecord = nlapiLoadRecord('vendor',vendorId)
	       
			var itemCount = billRecord.getLineItemCount('expense');	
	       
	         
	        
			nlapiLogExecution('DEBUG','subsidiary',subsidiaryId);
			nlapiLogExecution('DEBUG','totalAmount',totalAmount);
			nlapiLogExecution('DEBUG','vendorId',vendorId);
			nlapiLogExecution('DEBUG','vendorEmail',vendorRecord.getFieldValue('email'));
			nlapiLogExecution('DEBUG','recordId',recordId);
			nlapiLogExecution('DEBUG','itemCount',itemCount);
			nlapiLogExecution('DEBUG','advanceintercompanyjournalid',advanceintercompanyjournalid);
			nlapiLogExecution('DEBUG','tranDate',trandate);
			nlapiLogExecution('DEBUG','approvalstatus',approvalstatus);
			
	        if(parseInt(itemCount) > 0)
	        {
	        	if(approvalstatus == 2)
	        		{
			        	if(advanceintercompanyjournalid != '' && advanceintercompanyjournalid != null)
			        	{
			        		 nlapiDeleteRecord('advintercompanyjournalentry', advanceintercompanyjournalid);
			        	}
			        		
			            UpdateAdvanceInterCompanyJournal(itemCount,vendorRecord,subsidiaryId,totalAmount,vendorId,trandate,recordId,billRecord);
	        		}
	        }
   
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func afterSubmit',ex.message);
	}
}

function round(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function UpdateAdvanceInterCompanyJournal(itemCount,vendorRecord,subsidiaryId,totalAmount,vendorId,tranDate,recordId,billRecord)
{
  try{
             nlapiLogExecution('DEBUG','vendor record',vendorRecord);
             var vendorType =  vendorRecord.getFieldValue('custentity_vendortype');
             var vendorName = vendorRecord.getFieldValue('entityid');
             
              nlapiLogExecution('DEBUG','vendorName',vendorName);
              nlapiLogExecution('DEBUG','vendorType',vendorType);
              nlapiLogExecution('DEBUG','subsidiaryId',subsidiaryId);
              
              
           	var fils = new Array();
              var cols = new Array();
              cols.push(new nlobjSearchColumn('custrecord_expensesubsidary'));
  			cols.push(new nlobjSearchColumn('custrecord_percentage'));
  			cols.push(new nlobjSearchColumn('custrecord_intercompanyduefrom'));
  			cols.push(new nlobjSearchColumn('custrecord_intercompanydueto'));
  			 
              
              fils.push(new nlobjSearchFilter('custrecord_vendor_id',null,'is',vendorId));
              var searchResults = nlapiSearchRecord('customrecord_expenseallocation', null, fils, cols);
             
              if(searchResults == null || searchResults == 'null' || searchResults == '')
              {
              	//  nlapiLogExecution('DEBUG','searchResults is null',searchResults);
              	return;
              }
              
	            if(searchResults && searchResults.length < 2)
	            {
	                nlapiLogExecution('DEBUG','Vendor Expense Allocation Total Records',searchResults.length);
	                return false;
	            
	            }
              
    
                 var record = nlapiCreateRecord('advintercompanyjournalentry');
				   record.setFieldValue('subsidiary', subsidiaryId);
				   record.setFieldValue('trandate', tranDate);
				   record.setFieldValue('custbody_transactiondocumentnumber', recordId); 
				   
				 var parentSubsidaryDueFromAccountId = 0 ;
				 var parentSubsidaryDueToAccountId = 0 ;
				 
				 for ( var i = 0; i < searchResults.length; i++ )
				 {
					   var searchresult = searchResults[i];
					 //  var rec = nlapiLoadRecord(searchResults.getRecordType(),searchResults.getId());
                     
					   var linesubsidaryId = searchresult.getValue('custrecord_expensesubsidary');
					   var percentage = searchresult.getValue('custrecord_percentage');
					   var dueFromAccountId = searchresult.getValue('custrecord_intercompanyduefrom');
					   var dueToAccountId = searchresult.getValue('custrecord_intercompanydueto');
					   
					      if(subsidiaryId == linesubsidaryId)
						   {
			                   for(var j=1;j<=itemCount; j++)
			                   {
			                       var lineAccountId =  billRecord.getLineItemValue('expense', 'account', j);
			                       var lineAmount =  billRecord.getLineItemValue('expense', 'amount', j);
			                
			                        var percentAmount = round((parseFloat(lineAmount) / 100 ) * parseFloat(percentage));
			                        percentAmount = round(lineAmount - percentAmount);
			                       
			                        record.selectNewLineItem('line');
			                        record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
			                     
			                        record.setCurrentLineItemValue('line', 'account', lineAccountId);
			                        record.setCurrentLineItemValue('line', 'credit', percentAmount);
			                        record.setCurrentLineItemValue('line', 'entity', vendorId);
			                        record.commitLineItem('line');
			                     
			                        
			                        nlapiLogExecution('DEBUG','Statement','Line Expense : LineSubsidiary ' + subsidiaryId + ', Account '+ lineAccountId + ', Credit Amount '+ percentAmount+', Vendor '+ vendorId +', Percentage '+ percentage); 
			                        
			                   }
			                   
			                   parentSubsidaryDueFromAccountId = dueFromAccountId;
			                   parentSubsidaryDueToAccountId = dueToAccountId;
						   }
					   else{
						   
								    var percentAmount = round((parseFloat(totalAmount) / 100 ) * parseFloat(percentage));
			               	   
								    record.selectNewLineItem('line');
			                        record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryId);
			                        record.setCurrentLineItemValue('line', 'duetofromsubsidiary', linesubsidaryId); 
			                        record.setCurrentLineItemValue('line', 'account', dueFromAccountId);
			                        record.setCurrentLineItemValue('line', 'debit', percentAmount);
			                        record.setCurrentLineItemValue('line', 'entity', vendorId);
			                        record.setCurrentLineItemValue('line', 'eliminate', 'T');
			                        record.commitLineItem('line');
			                        
			                        nlapiLogExecution('DEBUG','Statement','Line Due From : LineSubsidiary ' + subsidiaryId + ', Account '+ dueFromAccountId  + ', Debited Amount '+ percentAmount +', Vendor '+ vendorId+', Percentage '+ percentage); 
					      }
					 
    				 }
				 
				 
				 
					 for ( var i = 0; i < searchResults.length; i++ )
					 {
						   var searchresult = searchResults[i];
						       
						   var linesubsidaryId = searchresult.getValue('custrecord_expensesubsidary');
						   var percentage = searchresult.getValue('custrecord_percentage');
						   var dueFromAccountId = searchresult.getValue('custrecord_intercompanyduefrom');
						   var dueToAccountId = searchresult.getValue('custrecord_intercompanydueto');
						   
						   if(subsidiaryId != linesubsidaryId){
								 
									for(var j=1;j<=itemCount; j++)
					                {
					                       var billlineAccountId =  billRecord.getLineItemValue('expense', 'account', j);
					                       var billlineAmount =  billRecord.getLineItemValue('expense', 'amount', j);
					              
					                  
					                     
					                        var percentAmount = round((parseFloat(billlineAmount) / 100 ) * parseFloat(percentage));
					                    
					                        record.selectNewLineItem('line');
					                        record.setCurrentLineItemValue('line', 'linesubsidiary', linesubsidaryId);
					                        record.setCurrentLineItemValue('line', 'account', billlineAccountId);
					                        record.setCurrentLineItemValue('line', 'debit', percentAmount);
					                        record.setCurrentLineItemValue('line', 'entity', vendorId);
					                        record.commitLineItem('line');
					                     
					                        nlapiLogExecution('DEBUG','Statement','Line Expense : LineSubsidiary ' + linesubsidaryId + ', Account '+ billlineAccountId + ', Debited Amount '+ percentAmount+', Vendor '+ vendorId +', Percentage '+ percentage); 
					                 }
									
										var percentAmount = round((parseFloat(totalAmount) / 100 ) * parseFloat(percentage));
					            		
										record.selectNewLineItem('line');
				                        record.setCurrentLineItemValue('line', 'linesubsidiary', linesubsidaryId);
				                        record.setCurrentLineItemValue('line', 'duetofromsubsidiary', subsidiaryId); 
				                        record.setCurrentLineItemValue('line', 'account', parentSubsidaryDueToAccountId);
				                        record.setCurrentLineItemValue('line', 'credit', percentAmount);
				                        record.setCurrentLineItemValue('line', 'entity', vendorId);
				                        record.setCurrentLineItemValue('line', 'eliminate', 'T');
				                        record.commitLineItem('line');
				                        
				                        nlapiLogExecution('DEBUG','Statement','Line Due To :  LineSubsidiary ' + linesubsidaryId + ', Account '+ parentSubsidaryDueToAccountId + ', Credit Amount '+ percentAmount+', Vendor '+ vendorId +', Percentage '+ percentage); 
							    	  
							      }
						      
						      
					 }
				 
				 var advintercompanyjournalentryId =  nlapiSubmitRecord(record);
               nlapiLogExecution('DEBUG','advintercompanyjournalentryId',advintercompanyjournalentryId);
               
              // var billRecord = nlapiLoadRecord('vendorbill',recordId)
               billRecord.setFieldValue('custbody_advanceintercompanyjournalid',advintercompanyjournalentryId);
               nlapiSubmitRecord(billRecord);
               
               window.location.reload(true);
    }
    catch(ex){
        nlapiLogExecution('ERROR','error in func UpdateAdvanceInterCompanyJournal',ex.message);
    }
}
