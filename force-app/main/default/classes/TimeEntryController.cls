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

    @AuraEnabled
    public static Map<String, String> createTimeCard(Map<Integer, Map<String, String>> objectTimeCard, Integer weekNumber) {
        List<Time_Card__c> timeCardList = new List<Time_Card__c>();
        Map<String, String> mapTimeCard = new Map<String, String>();
        if (!objectTimeCard.isEmpty()) {
            for (Integer index : objectTimeCard.keySet()) {
                Map<String, String> dataMap = objectTimeCard.get(index);
                if (dataMap.containsKey('projectName') && dataMap.containsKey('projectAssignmentId') && String.isNotBlank(dataMap.get('projectName'))) {
                    String nameTimeCard = dataMap.get('projectName') + '_Week_' + String.valueOf(weekNumber);
                    timeCardList.add(
                        new Time_Card__c(
                            Name = nameTimeCard,
                            Project_Assignment__c = dataMap.get('projectAssignmentId')
                        )
                    );
                    mapTimeCard.put(dataMap.get('projectAssignmentId'), nameTimeCard);
                }
            }
            insert timeCardList;
        }
        return mapTimeCard;
    }

    @AuraEnabled
    public static List<Time_Card_Split__c> createTimeCardSplit(Map<Integer, Map<String, String>> objectTimeCardSplit,
        Map<String, String> weekDayForInsertObject, Map<String, String> projectAssignmentIdMap) {
        List<Time_Card_Split__c> timeCardSplitList = new List<Time_Card_Split__c>();
        if (!objectTimeCardSplit.isEmpty() && !projectAssignmentIdMap.isEmpty()) {
            List<Time_Card__c> timeCardList = [SELECT Id, Name, Project_Assignment__c, Project_Name__c FROM Time_Card__c WHERE Project_Assignment__c IN :projectAssignmentIdMap.keySet()];
            System.debug('timeCardList '+ timeCardList);
            for (Time_Card__c timeCard : timeCardList) {
                for (Integer index : objectTimeCardSplit.keySet()) {
                    Map<String, String> dataMap = objectTimeCardSplit.get(index);
                    for (String day : dataMap.keySet()) {
                        if (dataMap.containsKey('projectName') && dataMap.containsKey('projectAssignmentId') && String.isNotBlank(dataMap.get('projectName'))) {
                            if (String.valueOf(timeCard.Project_Assignment__c).equals(dataMap.get('projectAssignmentId'))
                                && String.valueOf(timeCard.Name).equals(projectAssignmentIdMap.get(String.valueOf(timeCard.Project_Assignment__c)))
                                && !day.equals('projectName')
                                && !day.equals('projectAssignmentId')) {
                                timeCardSplitList.add(
                                    new Time_Card_Split__c(
                                        Name = String.valueOf(timeCard.Name) + '_' + weekDayForInsertObject.get(day) ,
                                        Type__c = 'Man-Hour',
                                        Start_Time__c = Time.newInstance(9, 0, 0, 0),
                                        Work_Date__c = Date.valueOf(weekDayForInsertObject.get(day)),
                                        End_Time__c = getEndTime(Decimal.valueOf(dataMap.get(day))),
                                        Time_Card__c = timeCard.Id
                                    )
                                );
                            }
                        }
                    }
                }
            }

            if (!timeCardSplitList.isEmpty()) {
                insert timeCardSplitList;
            }
        }
        return timeCardSplitList;
    }

    public static Time getEndTime(Decimal inputDate) {
        Integer hour = Integer.valueOf(Math.floor(inputDate));
        Integer minutes = Integer.valueOf(Math.floor((inputDate - hour) * 60));
        Time startTime = Time.newInstance(9, 0, 0, 0);
        Time endTime = startTime.addHours(hour);
        endTime = endTime.addMinutes(minutes);
        return endTime;
    }

    @AuraEnabled
    public static Map<String, String> checkExistTimeCard(Map<Integer, Map<String, String>> objectTimeCard, Integer weekNumber) {
        Map<String, String> timeCardMap = new Map<String, String>();
        if (!objectTimeCard.isEmpty()) {
            List<String> nameTimeCardList = new List<String>();
            for (Integer index : objectTimeCard.keySet()) {
                if (objectTimeCard.get(index).containsKey('projectName')) {
                    nameTimeCardList.add(
                        objectTimeCard.get(index).get('projectName')
                        + '_Week_' + String.valueOf(weekNumber)
                    );
                }
            }

            if (nameTimeCardList.size() > 0) {
                List<Time_Card__c> timeCardList = [SELECT Id, Name, Project_Assignment__r.Name FROM Time_Card__c WHERE Name IN :nameTimeCardList];
                if (timeCardList.size() > 0) {
                    for (Time_Card__c timeCard : timeCardList) {
                        timeCardMap.put((String) timeCard.id, timeCard.Project_Assignment__r.Name);
                    }
                }
            }
        }
        return timeCardMap;
    }
}