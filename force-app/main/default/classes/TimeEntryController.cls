public with sharing class TimeEntryController {

    @AuraEnabled
    public static List<customLookupController.SObJectResult> getProjectList(String userId) {
        List<customLookupController.SObJectResult> sObjectResultList = new List<customLookupController.SObJectResult>();
        if (String.isNotBlank(userId)) {
            List<Project_Assignment__c> projectAssignmentList = [SELECT Id, Project__c, Project__r.Name FROM Project_Assignment__c WHERE User__c = :userId];
            for (Project_Assignment__c projectAssignment : projectAssignmentList) {
                sObjectResultList.add(new customLookupController.SObjectResult(
                    (String) projectAssignment.Project__r.Name,
                    (String) projectAssignment.Project__c));
            }
        }
        return sObjectResultList;
    }
}