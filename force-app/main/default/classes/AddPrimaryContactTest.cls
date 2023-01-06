@IsTest
private class AddPrimaryContactTest {
	@IsTest
    static void executeTest() {
        // INSERT DATA TEST
        List<Account> accountList = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            Account account = new Account();
            account.Name = 'Test Account ' + i;
            if (i < 50) {
                account.BillingState = 'NY';
            } else {
                account.BillingState = 'CA';
            }
            accountList.add(account);
        }
        insert accountList;
		Contact contact = new Contact(Firstname = 'Test Contact', Lastname = 'Test Lastname');
        insert contact;

        // EXECUTE
        Test.startTest();
        System.enqueueJob(new AddPrimaryContact(contact, 'NY'));
        Test.stopTest();

        // CHECK RESULT
        List<Contact> contacts = [SELECT Id FROM Contact WHERE Contact.Account.BillingState = 'NY'];
        System.assertEquals(50, contacts.size());
    }
}