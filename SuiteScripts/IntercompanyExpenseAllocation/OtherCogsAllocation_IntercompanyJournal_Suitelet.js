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
		nlapiLogExecution('ERROR','error in func main in OtherCogsAllocation_IntercompanyJournal_Suitelet.js file',ex.toString());
	}
}



function handleGetRequest(req,res){
	try{
	 
		var filterObj = {};
		postingperiodParameter =  req.getParameter('pp');
		subsidiaryParameter =  req.getParameter('sub'); 
	 
		var rows = [];
		
		 
		
		
		 var form = nlapiCreateForm('Other Cogs Allocation Inter Company Journal');
		 form.setScript('customscript_othercogsintercompany_clien');	
	
		 form.addButton('custpage_btngetdetails','Get Other Cogs Allocation Journal','getOtherCogsJournalDetails();');
		
		 var myselectfield = form.addField('custpage_postingperiodfield', 'select', 'Select Accounting Period');
		 var subsidiaryfield = form.addField('custpage_subsidiary','select','Select Subsidiary','subsidiary').setMandatory(true);
		 
		 createPostingPeriodDropDown(myselectfield,postingperiodParameter);
		
		 form.addSubmitButton('Submit');
		if(postingperiodParameter != null && postingperiodParameter != '' && subsidiaryParameter != null && subsidiaryParameter != '')
		{
			myselectfield.setDefaultValue(postingperiodParameter);
			
			var records = getFilterOtherCogsAllocationByPostingPeriodIdSubsidiaryId(postingperiodParameter,subsidiaryParameter);
			
			if(records != null)
				{
			
			       nlapiLogExecution('DEBUG','Total Other Cogs Allocation Records',records.length);
			
					if(records && records.length>0){
						for(var i=0;i<records.length;i++){
							rows.push({	
								custpage_record_id : records[i].getId(),
							 	custpage_postingperiod : records[i].getText('custrecord_othercogspostingperiod'),
								custpage_subsidiary : records[i].getText('custrecord_othercogssubsidiary'),
							 	custpage_journal_id : records[i].getText('custrecord_othercogsintercompanyjournal'),			
								 
							});
						}
					}
				}
			
		 
				subsidiaryfield.setDefaultValue(subsidiaryParameter);
			 
		}
		
		var list = form.addSubList('othercogsjournal', 'list', 'Other Cogs Allocation Intercompany Journal');
		
		list.addField('custpage_record_id','text','Id').setDisplayType('hidden');
	 	list.addField('custpage_postingperiod','text','Period').setDisplayType('disabled');
		list.addField('custpage_subsidiary','text','Subsidiary').setDisplayType('disabled');
		list.addField('custpage_journal_id','text','Advance Intercomp. Journal').setDisplayType('disabled');
	 
	 	list.setLineItemValues(rows);
		 
		
	 	
	 	res.writePage(form);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handleGetRequest',ex.toString());
	}
}

function getFilterOtherCogsAllocationByPostingPeriodIdSubsidiaryId(postingperiodParameter,subsidiaryParameter)
{
	try{
		 
		   var postingPeriod = postingperiodParameter.split('__');
		
			var fils = new Array();
            var cols = new Array();
          
			cols.push(new nlobjSearchColumn('custrecord_othercogssubsidiary'));
			cols.push(new nlobjSearchColumn('custrecord_othercogspostingperiod'));
		 	cols.push(new nlobjSearchColumn('custrecord_othercogsintercompanyjournal'));
            
            fils.push(new nlobjSearchFilter('custrecord_othercogspostingperiod',null,'is',postingPeriod[0]));
            fils.push(new nlobjSearchFilter('custrecord_othercogssubsidiary',null,'is',subsidiaryParameter));
            
            var searchResults = nlapiSearchRecord('customrecord_othercogsallocationjournal', null, fils, cols);		
			
			
		return searchResults;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func getFilterOtherCogsAllocationByPostingPeriodIdSubsidiaryId',ex.toString());
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

 	

// Manual Script

function handlePostRequest(req,res)
{
	try{
	 
	  
			   var accountingPeriod = null;
			   var postingperiodfield   = req.getParameter("custpage_postingperiodfield");
			   var subsidiaryfield   = req.getParameter("custpage_subsidiary");
			   
			   nlapiLogExecution('DEBUG','Postingperiod Parameter',postingperiodfield);
			   nlapiLogExecution('DEBUG','Subsidiary Parameter',subsidiaryfield);
			   
			   if(postingperiodfield != null && postingperiodfield != '' && subsidiaryfield != null && subsidiaryfield != '')
			   {
				   
				     var totalDebitAmount = 0;
				     var totalCreditAmount = 0;
				     var otherCogAllocationAccountId = 1443;
				     
				     var parameters = postingperiodfield.split("__");
					 var postingId = parameters[0];
					 var endDate = parameters[1];
					 
				 	var subsidiaryCol = new nlobjSearchColumn('subsidiary', null, 'group');
				 	var accountCol = new nlobjSearchColumn('account', null, 'group');
				 	var amountCol = new nlobjSearchColumn('amount', null, 'sum');
				 	
				 	var parentSubsidiaryResults  = 	GetDueToFromSubsidiaryAccounts(subsidiaryfield); 
				 	var parentSubsidiaryDueToAccountId =   parentSubsidiaryResults[0].getValue('custrecord_dueto');
				 	
				 	
			         var searchResults = getOtherCogsAllocationResults(postingId,subsidiaryfield,subsidiaryCol,accountCol,amountCol);
			     
			         
			         
				     if(searchResults != null && searchResults.length > 0)
			    	 {
				    
				    	   var  record = nlapiCreateRecord('advintercompanyjournalentry');
						   record.setFieldValue('subsidiary', subsidiaryfield);
						   record.setFieldValue('trandate', endDate);
						   
						   	var subsidiary = new nlobjSearchColumn('subsidiary', null, 'group');
						 	var postingperiod = new nlobjSearchColumn('postingperiod', null, 'group');
						 	var custcol_gpharmacies = new nlobjSearchColumn('custcol_gpharmacies', null, 'group');
						 	var amount = new nlobjSearchColumn('amount', null, 'sum');
						 	var cogs = new nlobjSearchColumn('cogsamount', null, 'sum');
						 	var gPharmacyInternalIdCol = new nlobjSearchColumn('custcol_subsidiaries', null, 'group'); 
					 	
						 	var CogsResults =  GetAllRevenuesAndCogsBySubsidiaryAndPostingPeriod(subsidiaryfield,postingId,subsidiary,postingperiod,custcol_gpharmacies,amount,cogs,gPharmacyInternalIdCol);
						   
						 	var totalCogAmount = getTotalCogsAmount(CogsResults,custcol_gpharmacies,cogs);
						   
						 	 nlapiLogExecution('DEBUG','TotalCogAmount',totalCogAmount);
						 	 var totalSabziCogsAmount = 0;
							 	
							for(var i=0;i<CogsResults.length;i++)
							{
							 
								var gpharmaciesId = CogsResults[i].getValue(custcol_gpharmacies);
							 
							
							
								if(gpharmaciesId != '' && gpharmaciesId != null)
								{
									var cogsAmount = round((CogsResults[i].getValue(cogs)));
									  
									if(gpharmaciesId == 3 || gpharmaciesId == 4)
									{
										totalSabziCogsAmount    = (totalSabziCogsAmount + cogsAmount);
									}
								}
							}
							 
							 nlapiLogExecution('DEBUG','TotalSabziAndFedCogsAmount',totalSabziCogsAmount);
							 
						 	
							 
						 for ( var j = 0; j < searchResults.length; j++ )
						   {
							   
				        	   var searchresult = searchResults[j];
				        	   var subsidiaryValue = searchresult.getValue(subsidiaryCol);
							   var accountValue = searchresult.getValue(accountCol);
							   var amountValue = round(searchresult.getValue(amountCol));
							   
						        if(amountValue == 0)
						        	continue;
							 
							    totalCreditAmount = totalCreditAmount + amountValue;
							   
					           record.selectNewLineItem('line');
							   record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryfield);
	                           record.setCurrentLineItemValue('line', 'account', accountValue);
					           record.setCurrentLineItemValue('line', 'credit',amountValue);
	 				           record.commitLineItem('line');
					
					           nlapiLogExecution('DEBUG','Statement',' linesubsidiary : '+ subsidiaryfield +', account : '+ accountValue +', Credited Amount : '+ amountValue);
						   }	
						 
						  
					           
							    for(var i=0;i<CogsResults.length;i++)
								{
									var gpharmaciesId = CogsResults[i].getValue(custcol_gpharmacies);
									 
								
									
									if(gpharmaciesId != '' && gpharmaciesId != null && gpharmaciesId != "4")
									{
										var cogsAmount = round((CogsResults[i].getValue(cogs)));
	 								    var gPharmacyInternalId = CogsResults[i].getValue(gPharmacyInternalIdCol);
										
										var statementTotalAmount = 0;
									    for ( var j = 0; j < searchResults.length; j++ )
										   {
											   
								        	   var searchresult = searchResults[j];
								        	   var subsidiaryValue = searchresult.getValue(subsidiaryCol);
											   var accountValue = searchresult.getValue(accountCol);
											   var amountValue = round(searchresult.getValue(amountCol));
						 			    
											   if(amountValue == 0)
										        	continue;
											   
										
												   if(gpharmaciesId == "3")
													   {
														   var calculatedPercentage = (( totalSabziCogsAmount / totalCogAmount ) * 100);
														   var calculatedAmount =    ((amountValue/100) * calculatedPercentage );
														   calculatedAmount = round(calculatedAmount);
														   
														   
														   statementTotalAmount = round(statementTotalAmount + calculatedAmount);
														  
														   totalDebitAmount = totalDebitAmount + calculatedAmount;
														   
														   record.selectNewLineItem('line');
														   record.setCurrentLineItemValue('line', 'linesubsidiary', gPharmacyInternalId);
								                           record.setCurrentLineItemValue('line', 'account', accountValue);
												           record.setCurrentLineItemValue('line', 'debit', calculatedAmount);
								 				           record.commitLineItem('line');
								 				           
								 				          nlapiLogExecution('DEBUG','Statement',' linesubsidiary : '+ gPharmacyInternalId +', account : '+ accountValue +', Debited Amount : '+ calculatedAmount +', Percentage : '+ calculatedPercentage);
															
												        
													   }
												   else   {
														   var calculatedPercentage = (( cogsAmount / totalCogAmount ) * 100);
														   var calculatedAmount =    ((amountValue/100) * calculatedPercentage ); 
														   calculatedAmount = round(calculatedAmount);
														   
														
														   statementTotalAmount = round(statementTotalAmount + calculatedAmount);
														   totalDebitAmount = totalDebitAmount + calculatedAmount;
														   
														   record.selectNewLineItem('line');
														   record.setCurrentLineItemValue('line', 'linesubsidiary', gPharmacyInternalId);
								                           record.setCurrentLineItemValue('line', 'account', accountValue);
												           record.setCurrentLineItemValue('line', 'debit', calculatedAmount);
								 				           record.commitLineItem('line');
												        
								 				          nlapiLogExecution('DEBUG','Statement',' linesubsidiary : '+ gPharmacyInternalId +', account : '+ accountValue +', Debited Amount : '+ calculatedAmount +', Percentage : '+ calculatedPercentage);
													   }
													   
										 
												   var counter = j;
												   var counter = counter + 1;
											       if(counter == searchResults.length)
												   {
												   
														   if(gpharmaciesId == 3)
														    {
															   
															   var results  = 	GetDueToFromSubsidiaryAccounts(gPharmacyInternalId);
															   var dueFormAccountId  = results[0].getValue('custrecord_duefrom');
														 	   
															   var  totalDueFromAmount =  statementTotalAmount;
															 
															   totalDebitAmount = totalDebitAmount + totalDueFromAmount;
															   
															   record.selectNewLineItem('line');
													           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryfield);
													           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', gPharmacyInternalId);
													           record.setCurrentLineItemValue('line', 'account', dueFormAccountId);
													           record.setCurrentLineItemValue('line', 'debit', totalDueFromAmount);
													           record.setCurrentLineItemValue('line', 'eliminate', 'T');
													           record.commitLineItem('line');
													           
													           nlapiLogExecution('DEBUG','Statement','Due From  LineSubsidiary ' + subsidiaryfield + ', Account '+ dueFormAccountId + ', Debited Amount '+ totalDueFromAmount + ', Elimination : T ' + ', DueToFromSubsidiary ' + gPharmacyInternalId); 
															
													           totalCreditAmount = totalCreditAmount + totalDueFromAmount;
													           
													           record.selectNewLineItem('line');
													           record.setCurrentLineItemValue('line', 'linesubsidiary', gPharmacyInternalId);
													           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', subsidiaryfield);
													           record.setCurrentLineItemValue('line', 'account', parentSubsidiaryDueToAccountId);
													           record.setCurrentLineItemValue('line', 'credit', totalDueFromAmount);
													           record.setCurrentLineItemValue('line', 'eliminate', 'T');
													           record.commitLineItem('line');
													           
													           nlapiLogExecution('DEBUG','Statement','Due To  LineSubsidiary ' + gPharmacyInternalId + ', Account '+ parentSubsidiaryDueToAccountId + ', Credited Amount '+ totalDueFromAmount + ', Elimination : T ' + ', DueToFromSubsidiary ' + subsidiaryfield); 
														    }
														   else
														   {
																   var results  = 	GetDueToFromSubsidiaryAccounts(gPharmacyInternalId);
																   var dueFormAccountId  = results[0].getValue('custrecord_duefrom');
																 
																   var  totalDueFromAmount =  statementTotalAmount;
																   totalDebitAmount = totalDebitAmount + totalDueFromAmount;
																   
																   record.selectNewLineItem('line');
														           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryfield);
														           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', gPharmacyInternalId);
														           record.setCurrentLineItemValue('line', 'account', dueFormAccountId);
														           record.setCurrentLineItemValue('line', 'debit', totalDueFromAmount);
														           record.setCurrentLineItemValue('line', 'eliminate', 'T');
														           record.commitLineItem('line');
														           
														           nlapiLogExecution('DEBUG','Statement','Due From LineSubsidiary ' + subsidiaryfield + ', Account '+ dueFormAccountId + ', Debited Amount '+ totalDueFromAmount + ', Elimination : T ' + ', DueToFromSubsidiary ' + gPharmacyInternalId);
														           
														           totalCreditAmount = totalCreditAmount + totalDueFromAmount;
														           
														           record.selectNewLineItem('line');
														           record.setCurrentLineItemValue('line', 'linesubsidiary', gPharmacyInternalId);
														           record.setCurrentLineItemValue('line', 'duetofromsubsidiary', subsidiaryfield);
														           record.setCurrentLineItemValue('line', 'account', parentSubsidiaryDueToAccountId);
														           record.setCurrentLineItemValue('line', 'credit', totalDueFromAmount);
														           record.setCurrentLineItemValue('line', 'eliminate', 'T');
														           record.commitLineItem('line');
														           
														           nlapiLogExecution('DEBUG','Statement','Due To  LineSubsidiary ' + gPharmacyInternalId + ', Account '+ parentSubsidiaryDueToAccountId + ', Credited Amount '+ totalDueFromAmount + ', Elimination : T ' + ', DueToFromSubsidiary ' + subsidiaryfield); 
														   }
														   
														   
											     }
										
											}
										}
					           
					           
						       }
							   
							   
							   	totalCreditAmount = round(totalCreditAmount);
								totalDebitAmount = round(totalDebitAmount);
						   
							    nlapiLogExecution('DEBUG','Statement','Total Debited Amount ' + totalDebitAmount);
							    nlapiLogExecution('DEBUG','Statement','Total Credited Amount ' + totalCreditAmount);
							    
							
							    if(totalCreditAmount > totalDebitAmount)
							    	{
							    	   var remainingAmount = round(round(totalCreditAmount) - round(totalDebitAmount));
							    	   
							    	   record.selectNewLineItem('line');
							           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryfield);
							           record.setCurrentLineItemValue('line', 'account', otherCogAllocationAccountId);
							           record.setCurrentLineItemValue('line', 'debit', remainingAmount);
							          
							           record.commitLineItem('line');
							           
							           nlapiLogExecution('DEBUG','Statement','Other Cog Allocatoin Account : LineSubsidiary :  ' + subsidiaryfield + ', Account '+ otherCogAllocationAccountId + ', Debited Amount '+ remainingAmount );
							           
							    	}
							    else if(totalDebitAmount > totalCreditAmount)
							    	{
							    		var remainingAmount = round(round(totalDebitAmount) - round(totalCreditAmount));
							    	   
							    	   record.selectNewLineItem('line');
							           record.setCurrentLineItemValue('line', 'linesubsidiary', subsidiaryfield);
							           record.setCurrentLineItemValue('line', 'account', otherCogAllocationAccountId);
							           record.setCurrentLineItemValue('line', 'credit', remainingAmount);
							          
							           record.commitLineItem('line');
							           
							           nlapiLogExecution('DEBUG','Statement','Other Cog Allocatoin Account : LineSubsidiary :  ' + subsidiaryfield + ', Account '+ otherCogAllocationAccountId + ', Credited Amount '+ remainingAmount );
							           
							    	}
				     
				           if(record.getLineItemCount('line') > 0)
				        	   {
							           var journalentryId =  nlapiSubmitRecord(record);
									   nlapiLogExecution('DEBUG','Journal Entry Id ',journalentryId);
									     
									   if(journalentryId != null && journalentryId != '')
									   {
										   	 var  OtherCogsJournal =  nlapiCreateRecord('customrecord_othercogsallocationjournal');
										 
			 
										   	OtherCogsJournal.setFieldValue('custrecord_othercogssubsidiary',subsidiaryfield);
										   	OtherCogsJournal.setFieldValue('custrecord_othercogspostingperiod',postingId);
										   	OtherCogsJournal.setFieldValue('custrecord_othercogsintercompanyjournal',journalentryId);
								           
							                 nlapiSubmitRecord(OtherCogsJournal);
									   }
				        	   }
			    	 }
			   }
			
		 
		   var param = new Array();
           param['pp'] = postingperiodfield;	
		   param['sub'] = subsidiaryfield;		   
          res.sendRedirect('SUITELET', 'customscript_othercogsallocationjournal', 'customdeploy_othercogsallocationjournal', null, param);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handlePostRequest',ex.toString());
	}
}

function GetRemainingAmount(index,totalLines,topAccountAmount,statementTotalAmount)
{
	var differencAmount = 0;
	var counter = index + 1;
     if(counter == totalLines)
	 {
    	  	 differencAmount = round(topAccountAmount - statementTotalAmount);
    	  	// differencAmount = round(differencAmount);
    	    // nlapiLogExecution('DEBUG',' Differnce Statement ','topAccountAmount :'+ topAccountAmount +', statementTotalAmount :'+ statementTotalAmount +', Differnce Amount :' + differencAmount);
     }
     
     
     return differencAmount;
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

 

function getOtherCogsAllocationResults(postingperiodfield,subsidiaryId,subsidiarycol,accountcol,amountcol)
{
	try{
		
		var fils = new Array();
	    var search = nlapiLoadSearch('transaction','customsearch_cppothercogsaccount');
	 
	    fils.push(new nlobjSearchFilter('subsidiary',null,'is',subsidiaryId));
	    fils.push(new nlobjSearchFilter('postingperiod',null,'is',postingperiodfield));
	  	search.addFilters(fils);
	 	
	 	search.addColumn(subsidiarycol);
	 	search.addColumn(accountcol);
	 	search.addColumn(amountcol);
	 	
		var res = search.runSearch();
		var results = res.getResults(0,1000);
		
 
		nlapiLogExecution('DEBUG','CPP_Other Cogs total records ',results.length);
		 
	 //	nlapiLogExecution('DEBUG','Transaction','creditCardAccountId :'+creditCardAccountId+', creditCardSubsidiaryId :'+creditCardSubsidiaryId+', postingperiodfield :'+postingperiodfield+', creditCardAmount :'+creditCardAmount);
		return results;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func getOtherCogsAllocationResults',ex.toString());
	}
}



function GetAllRevenuesAndCogsBySubsidiaryAndPostingPeriod(subsidiaryId,postingPeriodId,subsidiary,postingperiod,custcol_gpharmacies,amount,cogs,gPharmacyInternalId)
{
	try{
			var fils = new Array();
		    var search = nlapiLoadSearch('transaction','customsearch_apharmaciesrevenue');
		    fils.push(new nlobjSearchFilter('subsidiary',null,'is',subsidiaryId));
		    fils.push(new nlobjSearchFilter('postingperiod',null,'is',postingPeriodId));
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
		nlapiLogExecution('ERROR','error in func GetAllRevenuesAndCogsBySubsidiaryAndPostingPeriod',ex.message);
	}
}


function round(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
 


function getTotalCogsAmount(CogsResults,custcol_gpharmacies,cogs)
{
   var totalCogAmount = 0;
	for(var i=0;i<CogsResults.length;i++)
		{
		
			var gpharmaciesId = CogsResults[i].getValue(custcol_gpharmacies);
		 	var cogsAmount = round((CogsResults[i].getValue(cogs)));
		
			if(gpharmaciesId != '' && gpharmaciesId != null)
			{
				
				totalCogAmount = round(totalCogAmount + cogsAmount);
			}
			
	   }
	
	return totalCogAmount;
}

