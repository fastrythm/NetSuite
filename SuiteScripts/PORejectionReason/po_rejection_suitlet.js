/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Feb 2019    sohail ahmed
 *
 */
// Rejection reason popup suitelet
function main(req,res){
    try{
                if(req.getMethod() == 'POST'){
			handlePostRequest(req,res);
		}
		else{
			handleGetRequest(req,res);
		}
    }
    catch(ex){
        nlapiLogExecution('ERROR','error in func main',ex.toString());
    }
}

function handleGetRequest(req,res){
    try{
       
        var recId = req.getParameter('recId');
     
   
        var form = nlapiCreateForm('Rejection Reason');
        
         form.setScript('customscript_po_rejection_reason_client');
        
    
        nlapiLogExecution('DEBUG','recId',recId);
        
        var rec = form.addField('custpage_rec_id','text','Rec Id').setDisplayType('hidden');
        rec.setDefaultValue(recId);
        
      
        form.addField('custpage_rejection_reason','multiselect','Rejection Reason','customlist_po_rejection_reasons').setMandatory(true);
         
        form.addField('custpage_rejection_message','textarea','Rejection Message').setDisplayType('disabled');
        form.addSubmitButton('Submit');
        res.writePage(form);
    }
    catch(ex){
        nlapiLogExecution('ERROR','error in func handleGetRequest',ex.toString());
    }
}

function handlePostRequest(req,res){
    try{
      nlapiLogExecution('DEBUG','start','start');
    	var context = nlapiGetContext();
		var user = context.getUser();
    
        var recId = req.getParameter('custpage_rec_id');
   
       
        var rejectionReason = req.getParameter('custpage_rejection_reason');
     
        var rejectionMessage = req.getParameter('custpage_rejection_message');
         
        var rec = nlapiLoadRecord('purchaseOrder',recId);
        
        nlapiLogExecution('DEBUG','Rejection Reason',rejectionReason);
        nlapiLogExecution('DEBUG','Rejection Message',rejectionMessage);
        
        rec.setFieldValue('custbody_po_rejection_reason',rejectionReason);
    	rec.setFieldValue('custbody_rejection_message',rejectionMessage);
    	
    
        rec.setFieldValue('approvalstatus',3);
        nlapiSubmitRecord(rec);
		nlapiLogExecution('DEBUG','mid','mid');
        res.writeLine('<script> window.close();window.opener.location.reload();</script>');
        nlapiLogExecution('DEBUG','end','end');
    }
    catch(ex){
        nlapiLogExecution('ERROR','error in func handlePostRequest',ex.toString());
    }
}



