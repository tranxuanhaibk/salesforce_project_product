@isTest
private class AccountProcessorTest {
	@isTest
    static void countContactsTest() {
        // Load data test
        List<Account> accountList = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            Account acc = new Account(Name = 'Test ' + i);
            accountList.add(acc);
        }
        insert accountList;

        List<Contact> contactList = new List<Contact>();
        List<Id> accountIds = new List<Id>();
        for (Account account : accountList) {
            Contact contact = new Contact(Firstname = 'Test ' + account.Name, LastName = 'LastName', AccountId = account.Id);
            accountIds.add(account.Id);
            contactList.add(contact);
        }
        insert contactList;
        
        // Run test
        Test.startTest();
        AccountProcessor.countContacts(accountIds);
        Test.stopTest();

        // Check result
        List<Account> accounts = [SELECT Id, Number_Of_Contacts__c FROM Account];
        for (Account account : accounts) {
            System.assertEquals(1, account.Number_Of_Contacts__c);
        }
    }
}