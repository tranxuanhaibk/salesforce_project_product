public with sharing class TimeEntryController {

    @AuraEnabled
    public static List<customLookupController.SObJectResult> getProjectAssignment(String userId) {
        List<customLookupController.SObJectResult> sObjectResultList = new List<customLookupController.SObJectResult>();
        if (String.isNotBlank(userId)) {
            List<Project_Assignment__c> projectAssignmentList = [SELECT Id, Project__c, Name FROM Project_Assignment__c WHERE User__c = :userId];
            for (Project_Assignment__c projectAssignment : projectAssignmentList) {
                sObjectResultList.add(new customLookupController.SObjectResult(
                    (String) projectAssignment.Name,
                    (String) projectAssignment.Id));
            }
        }
        return sObjectResultList;
    }

    public static Time getEndTime(Decimal inputDate) {
        Integer hour = Integer.valueOf(Math.floor(inputDate));
        Integer minutes = Integer.valueOf(Math.floor((inputDate - hour) * 60));
        Time startTime = Time.newInstance(9, 0, 0, 0);
        Time endTime = startTime.addHours(hour);
        endTime = endTime.addMinutes(minutes);
        // System.debug('hour' + hour);
        // System.debug('minutes' + minutes);
        // System.debug('endTime' + endTime);
        return endTime;
    }
}