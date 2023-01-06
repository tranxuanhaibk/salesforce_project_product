@IsTest
private class TestRestrictContactByName {
	@IsTest
    static void testInsertAccout() {
        Account acct = new Account(Name='Test Account');
        insert acct;
        
        Contact contact = new Contact(LastName='INVALIDNAME', AccountId=acct.Id);
        // Perform test
        Test.startTest();
        Database.SaveResult result = Database.insert(contact, false);
        Test.stopTest();
        
        // Verify 
        // In this case the deletion should have been stopped by the trigger,
        // so verify that we got back an error.
        System.assert(!result.isSuccess());
        System.assertEquals('The Last Name "' + contact.LastName + '" is not allowed for DML',
                            result.getErrors()[0].getMessage());
    }
}