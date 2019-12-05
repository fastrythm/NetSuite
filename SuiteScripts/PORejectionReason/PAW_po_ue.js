/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Mar 2018     imran.baig
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */

function beforeLoad(type,form){
	try{
      nlapiLogExecution('DEBUG','bfore_load','before_load');
		
       var context = nlapiGetContext();
		var user = context.getUser();
		form.setScript('customscript_paw_po_client');
		 
		
		
		if(type == 'view'){
          
          nlapiLogExecution('DEBUG','type','view');
			var rec = nlapiLoadRecord(nlapiGetRecordType(),nlapiGetRecordId());
			var poStatus = rec.getFieldValue('approvalstatus');
			var nextApprover = rec.getFieldValue('nextapprover');
			var subsidiary = rec.getFieldValue('subsidiary');
			var total = rec.getFieldValue('total');
			
			if(poStatus != 3){
				
				var porm = form.getField('custbody_rejection_message');
				porm.setDisplayType('hidden');
				var porr = form.getField('custbody_po_rejection_reason');
				porr.setDisplayType('hidden');
			}
			
          
          nlapiLogExecution('DEBUG','type',type);
          nlapiLogExecution('DEBUG','beforeload_status',rec.getFieldText('approvalstatus'));
          
          var next_fname = nlapiLookupField('employee', nextApprover, 'firstname');
           
          nlapiLogExecution('DEBUG','beforeload_nextapprover',rec.getFieldText('nextapprover'));
          nlapiLogExecution('DEBUG','beforeload_total',total);
         			
          if(is_PO_Approval_Subsidiary(subsidiary) && nextApprover == user && poStatus == 1 && parseFloat(total) >= 5000){
                      
            nlapiLogExecution('DEBUG','view_condition1','here');
				
            form.addButton('custpage_approve_button','Approve','approvePO();');
            //form.addButton('custpage_reject_button','Reject','rejectPO();');
            
               var script = '';    
            var URL2 = nlapiResolveURL('SUITELET', 'customscript_po_rejection_suitlet', 'customdeploy_bill_rejection_suitelet');
           
            URL2 += '&recId=' + nlapiGetRecordId();
            script += "nlOpenWindow('" + URL2 + "', 'rejection_reason_popup','width=915,height=400,resizable=yes,scrollbars=no');";
            
            form.addButton('custpage_reject_button','Reject',script);
			
            
			}
			if(is_PO_Approval_Subsidiary(subsidiary) && poStatus == 1){
				var btnPrint = form.getButton('print');
				var btnEmail = form.getButton('email');
				if(btnPrint != null){
					btnPrint.setVisible(false);
                  nlapiLogExecution('DEBUG','if_status==1','btnPrint!=null');
                }
              if(btnEmail != null){
					btnEmail.setVisible(false);
                nlapiLogExecution('DEBUG','if_status==1','btnEmail!=null');
				}
             
			}
		}
		if(type == 'edit' || type == 'create'){
			var postatus = nlapiGetFieldValue('approvalstatus');
			var subsidiary = nlapiGetFieldValue('subsidiary');
          
          nlapiLogExecution('DEBUG','type',type);
          
			if(postatus == 1 && is_PO_Approval_Subsidiary(subsidiary)){
				var btnPrint = form.getButton('print');
				var btnEmail = form.getButton('email');
              
               nlapiLogExecution('DEBUG','status==1','here');
              
				if(btnPrint != null){
					btnPrint.setVisible(false);
                  
                  nlapiLogExecution('DEBUG','print','not null');
				}
              
				if(btnEmail != null){
					btnEmail.setVisible(false);
                  nlapiLogExecution('DEBUG','email','not null');
				}		
				
			}
			
			if(poStatus != 3){
				
				var porm = form.getField('custbody_rejection_message');
				porm.setDisplayType('hidden');
				var porr = form.getField('custbody_po_rejection_reason');
				porr.setDisplayType('hidden');
			}
		}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func beforeLoad',ex.toString());
	}
}


function beforeSubmit(type){
	try{
		var context = nlapiGetContext();
		var userId = context.getUser();
		var subsidiary = nlapiGetFieldValue('subsidiary');
		var total = nlapiGetFieldValue('total');
      
      nlapiLogExecution('DEBUG','before_submit_type',type);
      var u = nlapiLookupField('employee', userId, 'firstname');
      var l = nlapiLookupField('employee', userId, 'lastname');
      nlapiLogExecution('DEBUG','bef_sub_user',u+' '+l);
      nlapiLogExecution('DEBUG','bef_sub_subs',subsidiary);
      nlapiLogExecution('DEBUG','bef_sub_total',total);
      
		if(type == 'create'){			
          nlapiLogExecution('DEBUG','type_before submit','create');
          nlapiLogExecution('DEBUG','subsidiary',is_PO_Approval_Subsidiary(subsidiary));
			if(parseFloat(total) >= 5000 && is_PO_Approval_Subsidiary(subsidiary)){				
				var empRec = nlapiLoadRecord('employee',userId);
				var approver = empRec.getFieldValue('purchaseorderapprover');
              
              nlapiLogExecution('DEBUG','if_total>=5000','here');
              var app_fname= nlapiLookupField('employee', approver, 'firstname');
               var app_lname= nlapiLookupField('employee', approver, 'lastname');
              
              nlapiLogExecution('DEBUG','create_approver',app_fname+' '+ app_lname);
				
				if(approver){
					nlapiSetFieldValue('approvalstatus',1);
					nlapiSetFieldValue('nextapprover',approver);
                  var n = nlapiLookupField('employee' , nlapiGetFieldValue('nextapprover'),'firstname');
                  nlapiLogExecution('DEBUG','next_approver set','approver');
                  nlapiLogExecution('DEBUG','create_approver_next_approver', n);
				}
				else{
					nlapiSetFieldValue('approvalstatus',2);
                  nlapiLogExecution('DEBUG','create_approval_status',nlapiGetFieldText('approvalstatus'));
				}
			}
			else{
				nlapiSetFieldValue('approvalstatus',2);
               nlapiLogExecution('DEBUG','else_total>=5000','here');
			}
		}
		if(type == 'edit'){
			var oldRec = nlapiGetOldRecord();
			var oldTotal = oldRec.getFieldValue('total');
			var postatus = nlapiGetFieldValue('approvalstatus');
           
		   nlapiLogExecution('DEBUG','edit',type);
           nlapiLogExecution('DEBUG','edit_oldtotal',oldTotal);
           nlapiLogExecution('DEBUG','PO Status',postatus);
		   
			if(parseFloat(oldTotal) < 5000 && parseFloat(total) >= 5000 && is_PO_Approval_Subsidiary(subsidiary)){
				var empRec = nlapiLoadRecord('employee',userId);
				var approver = empRec.getFieldValue('purchaseorderapprover');
              
              nlapiLogExecution('DEBUG','edit_if_oldtotal<5000_approver',approver);
              
				if(approver){
					nlapiSetFieldValue('approvalstatus',1);
					nlapiSetFieldValue('nextapprover',approver);
                  
                   nlapiLogExecution('DEBUG','edit_if_oldtotal<5000_approver',nlapiGetFieldText('nextapprover'));
				}
			}
			else if(parseFloat(oldTotal) > 5000 && parseFloat(total) > 5000 && parseFloat(oldTotal) != parseFloat(total)&& is_PO_Approval_Subsidiary(subsidiary)){
				var empRec = nlapiLoadRecord('employee',userId);
				var approver = empRec.getFieldValue('purchaseorderapprover');
				if(approver){
					nlapiSetFieldValue('approvalstatus',1);
					//nlapiSetFieldValue('nextapprover',approver);
					//
					
                  nlapiLogExecution('DEBUG','edit_if>5000_approver', approver);
				}
			}
			else if(parseFloat(oldTotal) >= 5000 && parseFloat(total) < 5000 && parseFloat(oldTotal) != parseFloat(total)&& is_PO_Approval_Subsidiary(subsidiary) && postatus == 1 ){
			 		 
				 nlapiSetFieldValue('approvalstatus',2);
				 
			}
		}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func beforeSubmit',ex.toString());
	}
}


function afterSubmit(type){
	try{
		//var emailParams = {};
		var subsidiary = nlapiGetFieldValue('subsidiary');
		var vendorId = nlapiGetFieldValue('entity');
		var createdBy = nlapiLookupField('purchaseorder', nlapiGetRecordId(), 'createdby');//nlapiGetFieldValue('createdby');
		var empRec = nlapiLoadRecord('employee',createdBy);
		var empEmail = empRec.getFieldValue('email');
		var vendorRec = nlapiLoadRecord('vendor',vendorId);
		var vendorEmail = vendorRec.getFieldValue('email');
		var approver = nlapiGetFieldValue('nextapprover');
		var subject = "PO Created";
		var body = "PFA PO";
		var records = new Object();
		records['transaction'] = nlapiGetRecordId();
		nlapiLogExecution('DEBUG','afterSubmit _PO#',nlapiGetFieldValue('tranid'));
       nlapiLogExecution('DEBUG','vendor',nlapiGetFieldText('entity'));
       nlapiLogExecution('DEBUG','approver',nlapiGetFieldText('nextapprover'));
      
		if(is_PO_Approval_Subsidiary(subsidiary)){
			var file = nlapiPrintRecord('TRANSACTION', nlapiGetRecordId(), 'DEFAULT', null);
			if(type == 'create'){
				var approvalStatus = nlapiGetFieldValue('approvalstatus');			
				if(approvalStatus == 2){
					if(vendorEmail){						
						sendEmail(createdBy,vendorEmail,subject,body,null,null,records,file);
					}				
				}
				if(approvalStatus == 1 && approver != null && approver != ''){
					var approverEmail = nlapiLookupField('employee', approver, 'email');
					var createsubject = 'PO To Approve';
					var createbody = "<p>PO "+nlapiGetFieldValue('tranid')+" has been created by "+ createdBy+" needs your approval.</p>";
					sendEmail(createdBy, approverEmail, createsubject, createbody,null,null,records,file);
				}
			}
			
			if(type == 'edit'){
				var oldRec = nlapiGetOldRecord();
				var newRec = nlapiGetNewRecord();
				var oldapprovalStatus = oldRec.getFieldValue('approvalstatus');
				var newapprovalStatus = newRec.getFieldValue('approvalstatus');
				if(oldapprovalStatus == 1 && newapprovalStatus == 2){				
					if(vendorEmail){
						sendEmail(createdBy,vendorEmail,subject,body,null,null,records,file);
					}
				}
				if(oldapprovalStatus == 1 && newapprovalStatus == 3){
					//var approver = nlapiGetFieldValue('nextapprover');
					var rejectionsubject = 'PO Rejected';
					var rejectionBody = "<p>PO "+nlapiGetFieldValue('tranid')+" has been rejected by "+ nlapiGetFieldText('nextapprover')+"</p>";
					sendEmail(approver,empEmail,rejectionsubject,rejectionBody,null,null,null,null);
				}
			}			
		}		
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func afterSubmit',ex.toString());
	}
}



function sendEmail(from,to,subject,body,cc,bcc,records,file){
	try{
		nlapiSendEmail(from, to, subject, body,cc,bcc,records,file);
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func sendEmail',ex.toString());
	}
}


function is_PO_Approval_Subsidiary(subsidiary){
	try{
      nlapiLogExecution('DEBUG','is_PO_Approval_Subsidiary','here');
		if(subsidiary){
          nlapiLogExecution('DEBUG','IF(SUBSIDIARY)','HERE');
			var fils = new Array();
			var cols = new Array();
			fils.push(new nlobjSearchFilter('custrecord_paw_subsidiary',null,'is',subsidiary));
			var searchResults = nlapiSearchRecord('customrecord_po_approval_mapping', null, fils, null);
			if(searchResults && searchResults.length > 0){
              nlapiLogExecution('DEBUG','IF Searchresults>0','true'+searchResults);
				return true;
			}
			else{
				return false;
              nlapiLogExecution('DEBUG','else Searchresults>0','false'+ searchResults);
			}
		}
		else{
			return false;
          nlapiLogExecution('DEBUG','else subsidiary_is_PO','here_false'+searchResults);
		}
		
		
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in is_PO_Approval_Subsidiary',ex.toString());
	}
}


