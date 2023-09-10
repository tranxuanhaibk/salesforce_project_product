public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        try {
            return [
                SELECT Id, FirstName, LastName, Email
                FROM Contact
                WITH SECURITY_ENFORCED
                LIMIT 20
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}