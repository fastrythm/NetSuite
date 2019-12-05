using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Web;
using System.Web.Services;
using System.Net;

using System.Xml;
using Netsuite_Record_Uploader.com.netsuite.sandbox.webservices;
using Netsuite_Record_Uploader.com.netsuite.webservices;
using Netsuite_Record_Uploader.com.netsuite.na3;
using DataCenterUrls = Netsuite_Record_Uploader.com.netsuite.webservices.DataCenterUrls;
using NetSuiteService = Netsuite_Record_Uploader.com.netsuite.webservices.NetSuiteService;


namespace Netsuite_Record_Uploader
{
    public partial class Form1 : Form
    {
        public Dictionary<string, string> LocationList = new Dictionary<string, string>();

        public Dictionary<string, string> DepartmentList = new Dictionary<string, string>();

        public Dictionary<string, string> BankAccountList = new Dictionary<string, string>();

        public Dictionary<string, string> SubsidiaryList = new Dictionary<string, string>();

        public Dictionary<string, string> EntityList = new Dictionary<string, string>();

        public Dictionary<string, string> ClassList = new Dictionary<string, string>();

        public Dictionary<int, string> Deposits = new Dictionary<int, string>();
        

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            
            
        }

        private void btnBrowse_Click(object sender, EventArgs e)
        {
            try
            {
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    txtFilePath.Text = ofd.FileName.Trim();
                }
            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
            }
            
        }

        private void btnUpload_Click(object sender, EventArgs e)
        {
           
            try
            {

                if (DepartmentList.Count < 1
                    || LocationList.Count < 1
                    || SubsidiaryList.Count < 1
                    || ClassList.Count < 1
                    || BankAccountList.Count < 1)
                {
                    lblError.Text = "Pleae upload all the select list field values";
                }
                else
                {
                    if (cmbEnvironment.SelectedItem == "Production")
                    {
                        productionImport();
                    }
                    else
                    {
                        sandboxImport();
                    }
                }

            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
                //service.logout();
            }

        }

        public void sandboxImport()
        {
            try
            {
                Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.NetSuiteService service = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.NetSuiteService() { Timeout = 1000 * 60 * 60 * 4 };
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                Deposits = new Dictionary<int, string>();
                var dc = service.getDataCenterUrls(txtAccount.Text);
                service.CookieContainer = new CookieContainer();
                service.preferences = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.Preferences();
                service.preferences.ignoreReadOnlyFields = true;
                service.preferences.ignoreReadOnlyFieldsSpecified = true;

                Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.Passport passport = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.Passport();

                passport.account = txtAccount.Text;
                passport.email = txtUserName.Text;
                Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef role = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                role.internalId = "3";
                passport.role = role;
                passport.password = txtPassword.Text;

                Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.Status status = service.login(passport).status;
                 
                CsvFileReader reader = new CsvFileReader(txtFilePath.Text.Trim());
                CsvRow row = new CsvRow();
                var firstline = reader.ReadRow(row);
                Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.Deposit baseDeposit = new com.netsuite.sandbox.webservices.Deposit();
                int l = 0;
                while (reader.ReadRow(row))
                {
                    Deposits.Add(l,row.LineText);
                    l++;                    
                }
 
                for (int i=0; i < Deposits.Count; )
                {
                    List<string> lines = new List<string>();
                    lines.Add(Deposits[i]);
                    for (int j = i + 1; j < Deposits.Count; j++)
                    {
                        var values = Deposits[j].Split(',');
                        if(Convert.ToInt16(values[9]) != 1)
                        {
                             lines.Add(Deposits[j]);
                            i = j;
                        }
                        else
                        {
                            break;
                        }
                        
                    }
                     createNSRecordSandbox(service, lines);
                    i++;  
                }
                service.logout();
                lblError.Text = "Records are successfuly uploaded";
            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
            }
        }

        public void productionImport()
        {
            try
            {
                Deposits = new Dictionary<int, string>();
                Netsuite_Record_Uploader.com.netsuite.webservices.NetSuiteService service = new Netsuite_Record_Uploader.com.netsuite.webservices.NetSuiteService() { Timeout = 1000 * 60 * 60 * 4 };
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                service = new DataCenterAwareNetSuiteService(txtAccount.Text, false);

                service.CookieContainer = new CookieContainer();
                service.preferences = new Netsuite_Record_Uploader.com.netsuite.webservices.Preferences();
                service.preferences.ignoreReadOnlyFields = true;
                service.preferences.ignoreReadOnlyFieldsSpecified = true;

                Netsuite_Record_Uploader.com.netsuite.webservices.Passport passport = new Netsuite_Record_Uploader.com.netsuite.webservices.Passport();

                passport.account = txtAccount.Text;
                passport.email = txtUserName.Text;
                Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef role = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                role.internalId = txtRoleId.Text;
                passport.role = role;
                passport.password = txtPassword.Text;
                
                Netsuite_Record_Uploader.com.netsuite.webservices.Status status = service.login(passport).status;

                CsvFileReader reader = new CsvFileReader(txtFilePath.Text.Trim());
                CsvRow row = new CsvRow();
                var firstline = reader.ReadRow(row);
                Netsuite_Record_Uploader.com.netsuite.webservices.Deposit baseDeposit = new com.netsuite.webservices.Deposit();
                int l = 0;
                while (reader.ReadRow(row))
                {
                    Deposits.Add(l, row.LineText);
                    l++;
                }

                for (int i = 0; i < Deposits.Count; )
                {
                    List<string> lines = new List<string>();
                    lines.Add(Deposits[i]);
                    for (int j = i + 1; j < Deposits.Count; j++)
                    {
                        var values = Deposits[j].Split(',');
                        if (Convert.ToInt16(values[9]) != 1)
                        {
                            lines.Add(Deposits[j]);
                            i = j;
                        }
                        else
                        {
                            break;
                        }

                    }
                    createNSRecordProduction(service, lines,(i+1));
                    i++;
                }
                service.logout();
                lblError.Text = "Records are successfuly uploaded";
            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
            }
        }

        public void createNSRecordSandbox(Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.NetSuiteService service, List<string> lines)
        {
            try
            {
                string[] values = lines[0].Split(',');
                //string[] fieldNames = new string[] { "Account", "Tran Date", "Posting Period", "Memo", "To Be Printed", "Business Unit", "Department", "Location", "Subsidiary", "Name", "Amount", "Account", "Check No.", "Department", "Business Unit", "Location", "Memo" };
                Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.Deposit deposit = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.Deposit();

                    deposit.account = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                    deposit.account.internalId = BankAccountList[values[0]];
                    if (values[1] != null && values[1] != "")
                    {
                        deposit.tranDate = Convert.ToDateTime(values[1] + " 01:00:00");
                        deposit.tranDateSpecified = true;
                    }

                    //deposit.postingPeriod = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                    //deposit.postingPeriod.name = values[2];
                    deposit.memo = values[3];
                    deposit.toBePrinted = Convert.ToBoolean(values[4]);

                if (ClassList.ContainsKey(values[5]))
                {
                    deposit.@class = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                    deposit.@class.internalId = ClassList[values[5]];
                }

                if (DepartmentList.ContainsKey(values[6]))
                {
                    deposit.department = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                    deposit.department.internalId = DepartmentList[values[6]];
                }
                if (LocationList.ContainsKey(values[7]))
                {
                    deposit.location = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                    deposit.location.internalId = LocationList[values[7]];
                }
               
                    deposit.subsidiary = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                    deposit.subsidiary.internalId = SubsidiaryList[values[8]];
                    //deposit.total = Convert.ToDouble(values[10]);
                    Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.DepositOtherList depositOtherList = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.DepositOtherList();
                    
                    depositOtherList.depositOther = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.DepositOther[lines.Count];
                    for (int i = 0; i < lines.Count; i++)
                    {
                        var linevalues = lines[i].Split(',');
                        Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.DepositOther depositOther = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.DepositOther();
                       
                        if (EntityList.ContainsKey(linevalues[10])) { 
                        depositOther.entity = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                        depositOther.entity.internalId = EntityList[linevalues[10]];
                        }
                        depositOther.account = new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                        depositOther.account.internalId = BankAccountList[linevalues[12]];
                        
                        if(!String.IsNullOrEmpty(Convert.ToString(linevalues[13])))
                        { depositOther.refNum = linevalues[13];}

                        if (DepartmentList.ContainsKey(linevalues[14]))
                        {
                            depositOther.department =
                                new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                            depositOther.department.internalId = DepartmentList[linevalues[14]];
                        }

                        if (ClassList.ContainsKey(linevalues[15]))
                        {
                            depositOther.@class =
                                new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                            depositOther.@class.internalId = ClassList[linevalues[15]];
                        }
                        if (LocationList.ContainsKey(linevalues[16]))
                        {
                            depositOther.location =
                                new Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.RecordRef();
                            depositOther.location.internalId = LocationList[linevalues[16]];
                        }
                        depositOther.memo = linevalues[17];
                        depositOther.amount = Convert.ToDouble(linevalues[11]);
                        depositOther.amountSpecified = true;
                        deposit.total = Convert.ToDouble(linevalues[11]);
                        depositOtherList.depositOther[i] = depositOther;
                        
                    }
                    deposit.otherList = depositOtherList;
                    Netsuite_Record_Uploader.com.netsuite.sandbox.webservices.WriteResponse wr = service.add(deposit); 
            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
                throw ex;
            }
           
        }

        public void createNSRecordProduction(Netsuite_Record_Uploader.com.netsuite.webservices.NetSuiteService service, List<string> lines,int lineNumber)
        {
            try
            {
                string[] values = lines[0].Split(',');
               
                //string[] fieldNames = new string[] { "Account", "Tran Date", "Posting Period", "Memo", "To Be Printed", "Business Unit", "Department", "Location", "Subsidiary", "Name", "Amount", "Account", "Check No.", "Department", "Business Unit", "Location", "Memo" };
                Netsuite_Record_Uploader.com.netsuite.webservices.Deposit deposit = new Netsuite_Record_Uploader.com.netsuite.webservices.Deposit();

                deposit.account = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                deposit.account.internalId = BankAccountList[values[0]];
                if (values[1] != null && values[1] != "")
                {
                    deposit.tranDate = Convert.ToDateTime(values[1] + " 01:00:00");
                    deposit.tranDateSpecified = true;
                }

                //deposit.postingPeriod = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                //deposit.postingPeriod.name = values[2];
                deposit.memo = values[3];
                deposit.toBePrinted = Convert.ToBoolean(values[4]);
                
                if (ClassList.ContainsKey(values[5]))
                {
                    deposit.@class = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                    deposit.@class.internalId = ClassList[values[5]];
                }
                if (DepartmentList.ContainsKey(values[6]))
                {
                    deposit.department = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                    deposit.department.internalId = DepartmentList[values[6]];
                }
                if (LocationList.ContainsKey(values[7]))
                {
                    deposit.location = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                    deposit.location.internalId = LocationList[values[7]];
                }
                deposit.subsidiary = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                deposit.subsidiary.internalId = SubsidiaryList[values[8]];
                //deposit.total = Convert.ToDouble(values[10]);
                Netsuite_Record_Uploader.com.netsuite.webservices.DepositOtherList depositOtherList = new Netsuite_Record_Uploader.com.netsuite.webservices.DepositOtherList();

                depositOtherList.depositOther = new Netsuite_Record_Uploader.com.netsuite.webservices.DepositOther[lines.Count];
                for (int i = 0; i < lines.Count; i++)
                {
                    var linevalues = lines[i].Split(',');
                    Netsuite_Record_Uploader.com.netsuite.webservices.DepositOther depositOther = new Netsuite_Record_Uploader.com.netsuite.webservices.DepositOther();

                    if (EntityList.ContainsKey(linevalues[10]))
                    {
                        depositOther.entity = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                        depositOther.entity.internalId = EntityList[linevalues[10]];
                    }

                    depositOther.account = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                    depositOther.account.internalId = BankAccountList[linevalues[12]];
                    depositOther.refNum = linevalues[13];

                    if (DepartmentList.ContainsKey(linevalues[14]))
                    {
                        depositOther.department = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                        depositOther.department.internalId = DepartmentList[linevalues[14]];
                    }
                    if (ClassList.ContainsKey(linevalues[15]))
                    {
                        depositOther.@class = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                        depositOther.@class.internalId = ClassList[linevalues[15]];
                    }
                    if (LocationList.ContainsKey(linevalues[16]))
                    {
                        depositOther.location = new Netsuite_Record_Uploader.com.netsuite.webservices.RecordRef();
                        depositOther.location.internalId = LocationList[linevalues[16]];
                    }
                    depositOther.memo = linevalues[17];
                    depositOther.amount = Convert.ToDouble(linevalues[11]);
                    depositOther.amountSpecified = true;
                    deposit.total = Convert.ToDouble(linevalues[11]);
                    depositOtherList.depositOther[i] = depositOther;

                }
                deposit.otherList = depositOtherList;
                Netsuite_Record_Uploader.com.netsuite.webservices.WriteResponse wr = service.add(deposit);

                txtSuccessLines.Text = txtSuccessLines.Text + " Line Number " + lineNumber  + Environment.NewLine;

            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;

                txtErrorLines.Text = txtErrorLines.Text + " Line Number " + lineNumber + " Message :" + ex.Message  + Environment.NewLine;
               
            }
        }

        private void btnListBrowse_Click(object sender, EventArgs e)
        {
            try
            {
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                  txtListsFilePath.Text = ofd.FileName.Trim();
                }
            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
            }
        }

        private void btnUploadListFile_Click(object sender, EventArgs e)
        {
            try
            {                
                updateSelectLists();
            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
            }
        }

        private void updateSelectLists()
        {
            try
            {
                CsvFileReader reader = new CsvFileReader(txtListsFilePath.Text.Trim());
                CsvRow row = new CsvRow();
                var firstline = reader.ReadRow(row);
                while (reader.ReadRow(row))
                {
                    var values = row.LineText.Split(',');
                    if(values[2].ToLower() == "subsidiary") 
                    {
                        if(!SubsidiaryList.ContainsKey(values[1]))
                            SubsidiaryList.Add(values[1], values[0]);
                    }
                    if (values[2].ToLower() == "account")
                    {
                        if (!BankAccountList.ContainsKey(values[1]))
                            BankAccountList.Add(values[1], values[0]);
                    }
                    if (values[2].ToLower() == "entity")
                    {
                        if (!EntityList.ContainsKey(values[1]))
                            EntityList.Add(values[1], values[0]);
                    }
                    if (values[2].ToLower() == "location")
                    {
                        if (!LocationList.ContainsKey(values[1]))
                            LocationList.Add(values[1], values[0]);
                    }
                    if (values[2].ToLower() == "class")
                    {
                        if (!ClassList.ContainsKey(values[1]))
                            ClassList.Add(values[1], values[0]);
                    }
                    if (values[2].ToLower() == "department")
                    {
                        if (!DepartmentList.ContainsKey(values[1]))
                            DepartmentList.Add(values[1], values[0]);
                    }
                }
                lblError.Text = "List fields are updated.";
            }
            catch (Exception ex)
            {
                lblError.ForeColor = Color.Red;
                lblError.Text = ex.Message;
            }
        }



        class DataCenterAwareNetSuiteService : NetSuiteService
        {

            private System.Uri OriginalUri;

            public DataCenterAwareNetSuiteService(string account, bool doNotSetUrl)
                : base()
            {
                OriginalUri = new System.Uri(this.Url);
                if (account == null || account.Length == 0)
                    account = "empty";
                if (!doNotSetUrl)
                {
                    //var temp = getDataCenterUrls(account);
                    DataCenterUrls urls = getDataCenterUrls(account).dataCenterUrls;
                    Uri dataCenterUri = new Uri(urls.webservicesDomain + OriginalUri.PathAndQuery);
                    this.Url = dataCenterUri.ToString();
                }
            }

            public void SetAccount(string account)
            {
                if (account == null || account.Length == 0)
                    account = "empty";

                this.Url = OriginalUri.AbsoluteUri;
                DataCenterUrls urls = getDataCenterUrls(account).dataCenterUrls;
                Uri dataCenterUri = new Uri(urls.webservicesDomain + OriginalUri.PathAndQuery);
                this.Url = dataCenterUri.ToString();
            }
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

    }


 
}
