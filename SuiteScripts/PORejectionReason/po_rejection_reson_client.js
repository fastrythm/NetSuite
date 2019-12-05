/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Feb 2019     sohail.ahmed
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
 // In this file just try to remove special characters from [^ -~] and show popup on when empty rejection reason add.
 
function fieldChanged(type, name, linenum){
	try{
		if(name == 'custpage_rejection_reason'){
			var rejectReason = nlapiGetFieldValue('custpage_rejection_reason');
			var rejReas = rejectReason.replace(/[^\x20-\x7E]+/g, ',');
			var rejResarr = rejReas.split(',');
			nlapiLogExecution('DEBUG','rejectReason',rejectReason);
			nlapiLogExecution('DEBUG','rejReas',rejReas[0]);
			var isOther = false;
			for(var i=0; i<rejResarr.length;i++){
				if(rejResarr[i] == 6){
					//nlapiDisableField('custpage_rejection_message',false);
					isOther=true;
					break;
				}
				//else{
					//nlapiDisableField('custpage_rejection_message',true);
					//nlapiSetFieldValue('custpage_rejection_message','');
				//}
			}
			if(isOther){
				nlapiDisableField('custpage_rejection_message',false);
			}
			else{
				nlapiDisableField('custpage_rejection_message',true);
				nlapiSetFieldValue('custpage_rejection_message','');
			}
			
		}
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func fieldChanged',ex.toString());
	}
}

function onSave(){
	try{
		if(nlapiGetFieldValue('custpage_rejection_reason') == 6 && (nlapiGetFieldValue('custpage_rejection_message') == '' || nlapiGetFieldValue('custpage_rejection_message') == null)){
			alert('Please Write Rejection Details in Rejection Message.');
			return false;
		}
		return true;
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func onSave',ex.toString());
	}
}

function pageInit(){
	try{
		var divOne = document.getElementById('custpage_rejection_reason_popup_new');
		divOne.parentNode.remove();
		nlapiRemoveSelectOption('custpage_rejection_reason', '-1');
	}
	catch(ex){
		nlapiLogExecution('ERROR','error in func pageInit',ex.toString());
	}
}
