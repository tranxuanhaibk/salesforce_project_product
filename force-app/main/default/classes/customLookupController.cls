public with sharing class customLookupController {

    @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getResults(String objectName, String fieldName, String value) {
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        system.debug(fieldName+'-------------'+ObjectName+'---++----------'+value);
        if (String.isNotEmpty(value)) {
            for (sObject sObj : Database.Query('Select Id,' + fieldName + ' FROM '+ ObjectName + ' WHERE ' + fieldName + ' LIKE \'%' + value + '%\'')) {
                String fieldvalue = (String) sObj.get(fieldName);
                sObjectResultList.add(new SObjectResult(fieldvalue, sObj.Id));
            }
        }
        return sObjectResultList;
    }

    public class SObJectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;

        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
    }
}