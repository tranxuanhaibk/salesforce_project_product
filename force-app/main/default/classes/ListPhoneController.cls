public with sharing class ListPhoneController {
    @AuraEnabled(cacheable=true)
    public static List<Phone__c> getSearchListPhone(String searchKey) {
        if (String.isBlank(searchKey)){
            return [
                SELECT Name, Image__c, Manufacturing_Date__c, Color__c, Expiration_Date__c, Remaining_Date__c, Capacity__c, Price__c
                FROM Phone__c
            ];
        } else {
            return [
                SELECT Name, Image__c, Manufacturing_Date__c, Color__c, Expiration_Date__c, Remaining_Date__c, Capacity__c, Price__c
                FROM Phone__c 
                WHERE Name
                LIKE :'%'+ searchKey +'%'
            ];
        }
    }
    @AuraEnabled 
    public static void deletePhone(List<Phone__c> phoneList){  
        delete phoneList;  
    }
}