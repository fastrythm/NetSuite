/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Sep 2018     sohail.ahmed
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
var global ;
function clientPageInit(type){
   
	global = type
	
 										
	
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord()
{
	if(global == 'create' || global == 'edit')
		{
			var requiredDate = nlapiGetFieldValue('custrecord_target_date');
			var requiredTime = nlapiGetFieldValue('custrecord_required_time');
			var datetimenow = requiredDate +' '+requiredTime;
			var d = new Date(datetimenow)
			var datetime = nlapiDateToString(d, 'datetimetz');
	        nlapiSetFieldValue('custrecord_required_date_time',datetime);
	        
		}
    return true;
}

function onResolveClick()
{
	 
	    
		var id = nlapiGetRecordId();
		nlapiLogExecution('DEBUG','Current record ID = ',id);
		
		var record= nlapiLoadRecord('customrecord_my_ticketing_system',id);
		
		var d  = new Date();
		var datetime = nlapiDateToString(d, 'datetimetz');
		
		record.setFieldValue('custrecord_my_ticket_status',2);
		record.setFieldValue('custrecord_resolve_date_time',datetime);
		
		
		var requiredDate = record.getFieldValue('custrecord_required_date_time');
		var reqDateObj = new Date(requiredDate);
		
	 
		 var diff =(reqDateObj.getTime() - d.getTime()) / 1000;
		 diff /= 60;
		 var value  = (Math.round(diff));
		
		 
		 nlapiLogExecution('DEBUG','Time Difference ',value);
		 
		record.setFieldValue('custrecord_my_ticket_time_taken',value);
		
		
		nlapiSubmitRecord(record); 
		
	 	//nlapiSetRedirectURL('RECORD','customrecord_my_ticketing_system',id);
	 	
	 	window.location.href  ="/app/common/custom/custrecordentrylist.nl?rectype=148"
	 
}


