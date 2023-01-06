public without sharing class AccountProcessor {

    @future
    public static void countContacts(List<Id> accountIds) {
        List<Account> accountList = [SELECT Id, (SELECT Id FROM Contacts) FROM Account WHERE Id IN :accountIds];
        for (Account account : accountList) {
            account.Number_Of_Contacts__c = account.Contacts.size();
        }
        update accountList;
    }
}