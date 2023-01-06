@IsTest
private class LeadProcessorTest { 
    @IsTest
    static void testExecute() {
       List<Lead> leadList = new List<Lead>();
       for (Integer i = 0; i < 200; i++) {
            leadList.add(new Lead(Lastname = 'Test ' + i, Company = 'Company ' + i));
       }
       insert leadList;

       Test.startTest();
       Id batchId = Database.executeBatch(new LeadProcessor());
       Test.stopTest();
        
       List<Lead> updateLeads = [SELECT Id FROM Lead WHERE LeadSource = 'Dreamforce'];
       System.assertEquals(200, updateLeads.size());
    }
}