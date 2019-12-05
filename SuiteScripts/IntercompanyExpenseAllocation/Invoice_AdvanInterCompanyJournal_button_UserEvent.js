
function beforeLoad_addButton(type, form) 
{
	  if(type == 'view')
		  {
		   
		  form.setScript('customscript_invoiceintercompanybutton'); 
		   form.addButton('custpage_generateAICJ_button', 'Generate Intercompany Allocation', 'onClickInvoiceButton()');  
		   form.addButton('custpage_generateADIA_button', 'Generate Avg. Disp. Income', 'onClickADIAButton()');  
		   
		  
		  }
}