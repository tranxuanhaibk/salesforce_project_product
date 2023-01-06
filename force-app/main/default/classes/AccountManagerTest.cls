@IsTest
private class AccountManagerTest {
	@IsTest
    static void testGetAccount() {
        Account a = new Account(Name='TestAccount');
        insert a;
        Contact c = new Contact(AccountId = a.Id, FirstName = 'Test', LastName = 'Test');
        insert c;
        
        RestRequest request = new RestRequest();
        request.requestURI = 'https://yourInstance.salesforce.com/services/apexrest//Accounts/' + a.Id + '/contacts';
        request.httpMethod = 'GET';
        RestContext.request = request;
        
        Account myAcc = AccountManager.getAccount();
        System.assert(myAcc != null);
        System.assertEquals('TestAccount', myAcc.Name);
    }
}