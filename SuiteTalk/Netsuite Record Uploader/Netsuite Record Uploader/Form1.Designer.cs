namespace Netsuite_Record_Uploader
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.ofd = new System.Windows.Forms.OpenFileDialog();
            this.btnBrowse = new System.Windows.Forms.Button();
            this.btnUpload = new System.Windows.Forms.Button();
            this.txtFilePath = new System.Windows.Forms.TextBox();
            this.lblFilePath = new System.Windows.Forms.Label();
            this.lblError = new System.Windows.Forms.Label();
            this.cmbEnvironment = new System.Windows.Forms.ComboBox();
            this.txtAccount = new System.Windows.Forms.TextBox();
            this.txtPassword = new System.Windows.Forms.TextBox();
            this.txtUserName = new System.Windows.Forms.TextBox();
            this.lblEnvironment = new System.Windows.Forms.Label();
            this.lblUserName = new System.Windows.Forms.Label();
            this.lblPassword = new System.Windows.Forms.Label();
            this.lblAccount = new System.Windows.Forms.Label();
            this.txtListsFilePath = new System.Windows.Forms.TextBox();
            this.btnListBrowse = new System.Windows.Forms.Button();
            this.btnUploadListFile = new System.Windows.Forms.Button();
            this.lblListFilePath = new System.Windows.Forms.Label();
            this.lblRoleId = new System.Windows.Forms.Label();
            this.txtRoleId = new System.Windows.Forms.TextBox();
            this.txtErrorLines = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.txtSuccessLines = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // btnBrowse
            // 
            this.btnBrowse.Location = new System.Drawing.Point(568, 265);
            this.btnBrowse.Name = "btnBrowse";
            this.btnBrowse.Size = new System.Drawing.Size(75, 23);
            this.btnBrowse.TabIndex = 0;
            this.btnBrowse.Text = "Browse";
            this.btnBrowse.UseVisualStyleBackColor = true;
            this.btnBrowse.Click += new System.EventHandler(this.btnBrowse_Click);
            // 
            // btnUpload
            // 
            this.btnUpload.Location = new System.Drawing.Point(649, 265);
            this.btnUpload.Name = "btnUpload";
            this.btnUpload.Size = new System.Drawing.Size(75, 23);
            this.btnUpload.TabIndex = 1;
            this.btnUpload.Text = "Upload";
            this.btnUpload.UseVisualStyleBackColor = true;
            this.btnUpload.Click += new System.EventHandler(this.btnUpload_Click);
            // 
            // txtFilePath
            // 
            this.txtFilePath.Location = new System.Drawing.Point(125, 265);
            this.txtFilePath.Name = "txtFilePath";
            this.txtFilePath.Size = new System.Drawing.Size(421, 20);
            this.txtFilePath.TabIndex = 5;
            // 
            // lblFilePath
            // 
            this.lblFilePath.AutoSize = true;
            this.lblFilePath.Location = new System.Drawing.Point(20, 272);
            this.lblFilePath.Name = "lblFilePath";
            this.lblFilePath.Size = new System.Drawing.Size(92, 13);
            this.lblFilePath.TabIndex = 3;
            this.lblFilePath.Text = "Deposits File Path";
            // 
            // lblError
            // 
            this.lblError.AutoSize = true;
            this.lblError.Location = new System.Drawing.Point(23, 293);
            this.lblError.Name = "lblError";
            this.lblError.Size = new System.Drawing.Size(0, 13);
            this.lblError.TabIndex = 4;
            // 
            // cmbEnvironment
            // 
            this.cmbEnvironment.FormattingEnabled = true;
            this.cmbEnvironment.Items.AddRange(new object[] {
            "Sandbox",
            "Production"});
            this.cmbEnvironment.Location = new System.Drawing.Point(125, 70);
            this.cmbEnvironment.Name = "cmbEnvironment";
            this.cmbEnvironment.Size = new System.Drawing.Size(163, 21);
            this.cmbEnvironment.TabIndex = 1;
            // 
            // txtAccount
            // 
            this.txtAccount.Location = new System.Drawing.Point(125, 229);
            this.txtAccount.Name = "txtAccount";
            this.txtAccount.Size = new System.Drawing.Size(163, 20);
            this.txtAccount.TabIndex = 4;
            // 
            // txtPassword
            // 
            this.txtPassword.Location = new System.Drawing.Point(125, 158);
            this.txtPassword.Name = "txtPassword";
            this.txtPassword.Size = new System.Drawing.Size(235, 20);
            this.txtPassword.TabIndex = 3;
            this.txtPassword.UseSystemPasswordChar = true;
            // 
            // txtUserName
            // 
            this.txtUserName.Location = new System.Drawing.Point(125, 113);
            this.txtUserName.Name = "txtUserName";
            this.txtUserName.Size = new System.Drawing.Size(235, 20);
            this.txtUserName.TabIndex = 2;
            // 
            // lblEnvironment
            // 
            this.lblEnvironment.AutoSize = true;
            this.lblEnvironment.Location = new System.Drawing.Point(21, 73);
            this.lblEnvironment.Name = "lblEnvironment";
            this.lblEnvironment.Size = new System.Drawing.Size(66, 13);
            this.lblEnvironment.TabIndex = 9;
            this.lblEnvironment.Text = "Environment";
            // 
            // lblUserName
            // 
            this.lblUserName.AutoSize = true;
            this.lblUserName.Location = new System.Drawing.Point(21, 120);
            this.lblUserName.Name = "lblUserName";
            this.lblUserName.Size = new System.Drawing.Size(60, 13);
            this.lblUserName.TabIndex = 10;
            this.lblUserName.Text = "User Name";
            // 
            // lblPassword
            // 
            this.lblPassword.AutoSize = true;
            this.lblPassword.Location = new System.Drawing.Point(23, 165);
            this.lblPassword.Name = "lblPassword";
            this.lblPassword.Size = new System.Drawing.Size(53, 13);
            this.lblPassword.TabIndex = 11;
            this.lblPassword.Text = "Password";
            // 
            // lblAccount
            // 
            this.lblAccount.AutoSize = true;
            this.lblAccount.Location = new System.Drawing.Point(23, 236);
            this.lblAccount.Name = "lblAccount";
            this.lblAccount.Size = new System.Drawing.Size(87, 13);
            this.lblAccount.TabIndex = 12;
            this.lblAccount.Text = "Account Number";
            // 
            // txtListsFilePath
            // 
            this.txtListsFilePath.Location = new System.Drawing.Point(126, 32);
            this.txtListsFilePath.Name = "txtListsFilePath";
            this.txtListsFilePath.Size = new System.Drawing.Size(421, 20);
            this.txtListsFilePath.TabIndex = 13;
            // 
            // btnListBrowse
            // 
            this.btnListBrowse.Location = new System.Drawing.Point(564, 32);
            this.btnListBrowse.Name = "btnListBrowse";
            this.btnListBrowse.Size = new System.Drawing.Size(75, 23);
            this.btnListBrowse.TabIndex = 14;
            this.btnListBrowse.Text = "Browse";
            this.btnListBrowse.UseVisualStyleBackColor = true;
            this.btnListBrowse.Click += new System.EventHandler(this.btnListBrowse_Click);
            // 
            // btnUploadListFile
            // 
            this.btnUploadListFile.Location = new System.Drawing.Point(645, 32);
            this.btnUploadListFile.Name = "btnUploadListFile";
            this.btnUploadListFile.Size = new System.Drawing.Size(75, 23);
            this.btnUploadListFile.TabIndex = 15;
            this.btnUploadListFile.Text = "Upload List";
            this.btnUploadListFile.UseVisualStyleBackColor = true;
            this.btnUploadListFile.Click += new System.EventHandler(this.btnUploadListFile_Click);
            // 
            // lblListFilePath
            // 
            this.lblListFilePath.AutoSize = true;
            this.lblListFilePath.Location = new System.Drawing.Point(23, 35);
            this.lblListFilePath.Name = "lblListFilePath";
            this.lblListFilePath.Size = new System.Drawing.Size(72, 13);
            this.lblListFilePath.TabIndex = 16;
            this.lblListFilePath.Text = "Lists File Path";
            // 
            // lblRoleId
            // 
            this.lblRoleId.AutoSize = true;
            this.lblRoleId.Location = new System.Drawing.Point(23, 200);
            this.lblRoleId.Name = "lblRoleId";
            this.lblRoleId.Size = new System.Drawing.Size(66, 13);
            this.lblRoleId.TabIndex = 18;
            this.lblRoleId.Text = "User Role Id";
            // 
            // txtRoleId
            // 
            this.txtRoleId.Location = new System.Drawing.Point(125, 193);
            this.txtRoleId.Name = "txtRoleId";
            this.txtRoleId.Size = new System.Drawing.Size(163, 20);
            this.txtRoleId.TabIndex = 17;
            // 
            // txtErrorLines
            // 
            this.txtErrorLines.Location = new System.Drawing.Point(126, 387);
            this.txtErrorLines.Multiline = true;
            this.txtErrorLines.Name = "txtErrorLines";
            this.txtErrorLines.Size = new System.Drawing.Size(598, 70);
            this.txtErrorLines.TabIndex = 19;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(19, 375);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(77, 13);
            this.label1.TabIndex = 20;
            this.label1.Text = "Error Lines No.";
            this.label1.Click += new System.EventHandler(this.label1_Click);
            // 
            // txtSuccessLines
            // 
            this.txtSuccessLines.Location = new System.Drawing.Point(126, 311);
            this.txtSuccessLines.Multiline = true;
            this.txtSuccessLines.Name = "txtSuccessLines";
            this.txtSuccessLines.Size = new System.Drawing.Size(598, 70);
            this.txtSuccessLines.TabIndex = 21;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(18, 336);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(106, 13);
            this.label2.TabIndex = 22;
            this.label2.Text = "Successfull Lines No";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(763, 469);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.txtSuccessLines);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.txtErrorLines);
            this.Controls.Add(this.lblRoleId);
            this.Controls.Add(this.txtRoleId);
            this.Controls.Add(this.lblListFilePath);
            this.Controls.Add(this.btnUploadListFile);
            this.Controls.Add(this.btnListBrowse);
            this.Controls.Add(this.txtListsFilePath);
            this.Controls.Add(this.lblAccount);
            this.Controls.Add(this.lblPassword);
            this.Controls.Add(this.lblUserName);
            this.Controls.Add(this.lblEnvironment);
            this.Controls.Add(this.txtUserName);
            this.Controls.Add(this.txtPassword);
            this.Controls.Add(this.txtAccount);
            this.Controls.Add(this.cmbEnvironment);
            this.Controls.Add(this.lblError);
            this.Controls.Add(this.lblFilePath);
            this.Controls.Add(this.txtFilePath);
            this.Controls.Add(this.btnUpload);
            this.Controls.Add(this.btnBrowse);
            this.Name = "Form1";
            this.Text = "Netsuite Record Uploader";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.OpenFileDialog ofd;
        private System.Windows.Forms.Button btnBrowse;
        private System.Windows.Forms.Button btnUpload;
        private System.Windows.Forms.TextBox txtFilePath;
        private System.Windows.Forms.Label lblFilePath;
        private System.Windows.Forms.Label lblError;
        private System.Windows.Forms.ComboBox cmbEnvironment;
        private System.Windows.Forms.TextBox txtAccount;
        private System.Windows.Forms.TextBox txtPassword;
        private System.Windows.Forms.TextBox txtUserName;
        private System.Windows.Forms.Label lblEnvironment;
        private System.Windows.Forms.Label lblUserName;
        private System.Windows.Forms.Label lblPassword;
        private System.Windows.Forms.Label lblAccount;
        private System.Windows.Forms.TextBox txtListsFilePath;
        private System.Windows.Forms.Button btnListBrowse;
        private System.Windows.Forms.Button btnUploadListFile;
        private System.Windows.Forms.Label lblListFilePath;
        private System.Windows.Forms.Label lblRoleId;
        private System.Windows.Forms.TextBox txtRoleId;
        private System.Windows.Forms.TextBox txtErrorLines;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txtSuccessLines;
        private System.Windows.Forms.Label label2;
    }
}

