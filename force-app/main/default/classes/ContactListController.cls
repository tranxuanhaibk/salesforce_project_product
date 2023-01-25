public with sharing class ContactListController {

    @AuraEnabled
    public static List<Contact> getContactList() {
        List<Contact> contactList = new List<Contact>([SELECT Id, Name, Email, Phone FROM Contact WHERE Email != null]);
        return contactList;
    }
}