public without sharing class DailyLeadProcessor implements Schedulable {
    public void execute(SchedulableContext ctx) {
    	List<Lead> leadList = [SELECT Id, LeadSource FROM Lead WHERE LeadSource = null LIMIT 200];
		for (Lead lead : leadList) {
            lead.LeadSource = 'Dreamforce';
		}
        update leadList;
    }
}