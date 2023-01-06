@IsTest
private class DailyLeadProcessorTest {
    private static String CRON_EXP = '0 0 0 ? * * *';
	@IsTest
    static void testExecute() {
        // Load data
        List<Lead> leadList = new List<Lead>();
        for (Integer i = 0; i < 200; i++) {
            Lead lead = new Lead(Firstname = 'Firstname ' + i, Lastname = 'Test lead', Company = 'Salesforce');
            leadList.add(lead);
        }
        insert leadList;
        
        // Execute Schedule
        Test.startTest();
        String jobId = System.schedule('Process Leads', CRON_EXP, new DailyLeadProcessor());
        Test.stopTest();
        
        // CHECK RESULT
        List<Lead> leads = [SELECT Id FROM Lead WHERE LeadSource = 'Dreamforce'];
        System.assertEquals(200, leadList.size());
        
        // Check the scheduled time
        List<CronTrigger> cts = [SELECT Id, TimesTriggered, NextFireTime FROM CronTrigger WHERE Id = :jobId];
        System.debug('Next fire time ' + cts[0].NextFireTime);
    }
}