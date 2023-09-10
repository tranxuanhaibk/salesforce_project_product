public with sharing class AccountListControllerLwc {
    @AuraEnabled(cacheable=true)
    public static List<Account> queryAccountsByRevenue(Decimal annualRevenue) {
        List<Account> accounts = [SELECT Id, Name FROM Account WHERE AnnualRevenue >= :annualRevenue];
        return accounts;
    }
}