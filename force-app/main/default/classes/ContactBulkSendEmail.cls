public with sharing class ContactBulkSendEmail {
    @auraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        List<Contact> contactList = [SELECT Id, FirstName, LastName, Email, Phone FROM Contact LIMIT 5000];
        return contactList;
    }
}