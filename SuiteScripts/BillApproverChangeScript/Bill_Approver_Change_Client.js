


/*function onBillEmployeeChange(type,name,lineNumber)
{
	if(name == 'custpage_form_approver_employee')
		{
		   var employeeId = nlapiGetFieldValue('custpage_form_approver_employee');
		   		   
		   if(employeeId != '')
			 {
			 			   
			   	var url = nlapiResolveURL('SUITELET', 'customscript_bill_approver_change_suite', 'customdeploy_bill_approver_change_deploy');
				url += '&empid='+employeeId;
				window.onbeforeunload = function(){};
				window.location.href = url;
			 }
		}
}

*/

function getBills()
{
 
	//if(name == 'custpage_form_approver_employee')
		{
		   var employeeId = nlapiGetFieldValue('custpage_form_approver_employee');
		   		   
		  // if(employeeId != '')
			 {
			 			   
			   	var url = nlapiResolveURL('SUITELET', 'customscript_bill_approver_change_suite', 'customdeploy_bill_approver_change_deploy');
				url += '&empid='+employeeId;
				window.onbeforeunload = function(){};
				window.location.href = url;
			 }
		}
}