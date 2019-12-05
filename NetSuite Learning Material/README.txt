Notes for Developer Certification Exam Preparation session
==========================================================

----------------------------------------------
SuiteScript
----------------------------------------------
Download all the script to an IDE, whether SuiteCloud IDE or otherwise. 

Make sure you read all the comments in the script files.

Most of the Suitelet scripts are UI Suitelets. Run them by opening up the script deployment and clicking on the URL.

There is one portlet script. Execute it by personalizing the dashboard with a custom portlet

There are hardcoded internal ids for records, custom forms, and other objects. You may need to change these values.

You may need to create some custom records in Performance Review or Furniture record types.

Some scripts have different functions reflecting different options. You may need to modify the script record to point to a different function.

Remember that if there are multiple script deployments, you see the log messages of all deployments if you view the execution log subtab from the script record.


----------------------------------------------
SuiteTalk
----------------------------------------------
The C# code was created using Visual Studio Express 2013 for Windows Desktop.

If you're using Eclipse with the Java code, you can set things up as follows:
    - Create a Java project
    - Import Archive File into the project, selecting the zip of java code
    - You may get prompted about overriding .classpath file. Click Yes.

In the Java code, the methods referred to in the objectives can be found in package 
com.netsuite.developercertcourse

Make sure you read all the comments in the integration code.

All integration code was built using the 2014.2 WSDL.

There are hardcoded internal ids for records, custom forms, and other objects. You may need to change these values.

Make sure to configure account and login information as applicable in setPassport, getDataCenterURLs, and login methods.

Some methods access custom fields and custom record data. Make sure you have created the applicable custom records and set custom field data on associated records. The integration code is missing things like checks for nulls, so you may get exceptions in certain cases without the necessary data configuration.

Requests to get async status and async results need to be modified to represent valid job IDs.


----------------------------------------------
General
----------------------------------------------
You may need to add data to standard records for some examples to work correctly. For instance, sales order transactions need to be added to run through some of the scenarios related to objective "Given a scenario, select the sourcing and filtering criteria, or the defaulting and validation options for custom fields".
