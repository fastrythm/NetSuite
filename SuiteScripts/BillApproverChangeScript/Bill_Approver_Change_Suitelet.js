
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
		nlapiLogExecution('ERROR','error in func main in Bill_Approver_Change_Suitelet.js file',ex.toString());
	}
}


function handleGetRequest(req,res){
	try{
		var filterObj = {};
		filterObj.employeeId = req.getParameter('empid');
		//nlapiLogExecution('DEBUG','Pending Bills',filterObj.employeeId);
		
		var bills = getFilterBillByEmployeeId(filterObj);
		
		nlapiLogExecution('DEBUG','Total Bill Records',bills.length);
		var rows = [];
		if(bills && bills.length>0){
			for(var i=0;i<bills.length;i++){
				rows.push({	
					custpage_bill_id : bills[i].getId(),
					custpage_bill_date : bills[i].getValue('trandate'),
					custpage_bill_period : bills[i].getText('postingperiod'),
					custpage_bill_documentno : bills[i].getValue('tranid'),
					custpage_bill_name : bills[i].getValue('name'),			
					custpage_bill_account : bills[i].getText('account'),			
					custpage_bill_memo : bills[i].getValue('memo'),	
					custpage_bill_amount : bills[i].getValue('amount'),	
				});
			}
		}
		
		var form = nlapiCreateForm('Open Bills List');
		
		form.setScript('customscript_bill_approver_change_client');	
		
		var SelectedEmployee = form.addField('custpage_form_approver_employee','select','Approver Employee','employee');
		form.addButton('custpage_getBills','Get Bills','getBills();');
		
		form.addField('custpage_form_assign_to_employee','select','Assign to Employee','employee');
		
		var list = form.addSubList('pending_bills', 'list', 'Pending Bills');
		list.addMarkAllButtons();
	 
		list.addField('custpage_chkrow','checkbox','Select');
	 	
		list.addField('custpage_bill_id','text','Id').setDisplayType('hidden');
		list.addField('custpage_bill_date','text','Date').setDisplayType('disabled');
		list.addField('custpage_bill_period','text','Period').setDisplayType('disabled');
		list.addField('custpage_bill_documentno','text','Document No').setDisplayType('disabled');
		list.addField('custpage_bill_name','text','Name').setDisplayType('disabled');
		list.addField('custpage_bill_account','text','Account').setDisplayType('disabled');
		list.addField('custpage_bill_memo','text','Memo').setDisplayType('disabled');
		list.addField('custpage_bill_amount','text','Amount').setDisplayType('disabled');
		list.setLineItemValues(rows);
		 
		
		form.addSubmitButton('Submit');
		
		
		if(filterObj.employeeId != null && filterObj.employeeId != ''){
			SelectedEmployee.setDefaultValue(filterObj.employeeId);
		}
		 
		res.writePage(form);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handleGetRequest',ex.toString());
	}
}


function getFilterBillByEmployeeId(filterObj)
{
	try{
		var fils = new Array();
		nlapiLogExecution('DEBUG','Search on Employee ID ',filterObj.employeeId);
		var search = nlapiLoadSearch('transaction','customsearch_bill_approval_change_search');
		if(filterObj.employeeId != '' && filterObj.employeeId != null )
			{
		    fils.push(new nlobjSearchFilter('custbody_department_approver',null,'is',filterObj.employeeId));
		 	search.addFilters(fils);
			}
			var res = search.runSearch();
			var results = res.getResults(0,1000);
		 
		
		return results;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func getFilterBillByEmployeeId',ex.toString());
	}
}

 

function handlePostRequest(req,res)
{
	try{
	var lineCount = req.getLineItemCount('pending_bills');	
	var assignToEmployeeId =	req.getParameter('custpage_form_assign_to_employee')
	nlapiLogExecution('DEBUG','Selected Item Count is',lineCount);
	
	var paymentObject = {};
 	
	if(assignToEmployeeId != "" && assignToEmployeeId != null)
		{
			for(var i=1; i<=lineCount; i++) 
			{
		    	
		    	if(req.getLineItemValue('pending_bills','custpage_chkrow',i) == 'T')
		    	{
		    		var billId = req.getLineItemValue('pending_bills','custpage_bill_id',i) 
		    		
		    		var record = nlapiLoadRecord('vendorbill',billId);
		    		record.setFieldValue('custbody_department_approver',assignToEmployeeId);
		    	
		    		nlapiSubmitRecord(record); 
		    		
		    	}
		    }
		}
	
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func handlePostRequest',ex.toString());
	}
}
