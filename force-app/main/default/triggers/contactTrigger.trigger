trigger contactTrigger on Contact (before insert, before update, after insert, after update) {
    if (Trigger.isBefore) {
        List<Contact> contactAllList = [SELECT Id, AccountId FROM Contact WHERE Contact_Role__c = 'Financial Contact Point'];
        Map<String, String> accountIdMap = new Map<String, String>();
        for (Contact contactAll : contactAllList) {
            if (String.isNotBlank(contactAll.AccountId)) {
                accountIdMap.put(contactAll.AccountId, contactAll.Id);
            }
        }
    }
    
    //     for (Contact contact : Trigger.new) {
    //         List<String> errorList = new List<String>();
    //         if (contact.Contact_Role__c == null) {
    //             contact.addError('Please add Contact Role before create Contact');
    //         }
    //         if (contact.Contact_Role__c.equals('Financial Contact Point')) {
    //             if (String.isBlank(contact.FirstName) || String.isBlank(contact.Email)) {
    //                 errorList.add(
    //                     'Financial Contact needs to have Email and First Name');
    //             }
    
    //             if (!accountIdMap.isEmpty() && accountIdMap.containsKey(contact.AccountId) && !accountIdMap.get(contact.AccountId).equals(contact.Id)) {
    //                 errorList.add(
    //                     'An account can only have one financial contact');
    //             }
    //         }
    
    //         if (errorList.size() > 0) {
    //             contact.addError(String.join(errorList, '\n'));
    //         }
    //     }
    // } else if (Trigger.isAfter) {
    //     Map<String, List<String>> dateOfContactMap = new Map<String, List<String>>();
    //     for (Contact contact : Trigger.new) {
    //         if (contact.Contact_Role__c == null) {
    //             return;
    //         }
    //         if (contact.Contact_Role__c.equals('Financial Contact Point') && String.isNotBlank(contact.AccountId)) {
    //             String billingContactName = String.isNotBlank(contact.Salutation) ? 
    //                 (contact.Salutation + ' ' + contact.FirstName + ' ' + contact.LastName)
    //                 : (contact.FirstName + ' ' + contact.LastName);
    //             dateOfContactMap.put(contact.AccountId, new List<String>{
    //                 billingContactName, contact.Email
    //             });
    //         }
    //     }

    //     if (!dateOfContactMap.isEmpty()) {
    //         List<Account> accountList = [SELECT Id, Billing_Contact_Name__c, Billing_Contact_Email__c FROM Account WHERE Id IN :dateOfContactMap.keySet()];
    //         for (Account account : accountList) {
    //             account.Billing_Contact_Name__c = dateOfContactMap.get(account.Id).get(0);
    //             account.Billing_Contact_Email__c = dateOfContactMap.get(account.Id).get(1);
    //         }
    //         update accountList;
    //     }
    // }
}