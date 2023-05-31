public class TimeCardInvoiceController {

  public String timeCardId{get; set;}
  public Time_Card__c timeCard{get;set;}
  public String billingAddress{get;set;}

  public TimeCardInvoiceController() {
    timeCardId = ApexPages.currentPage().getParameters().get('id');
    List<Time_Card__c> timeCardList = [SELECT 
        Id, Project_Assignment__r.Project__r.Customer__r.Name, Project_Assignment__r.Project__r.Customer__r.BillingAddress,
        Project_Assignment__r.Project__r.Customer__r.Billing_Contact_Name__c, Project_Assignment__r.Project__r.Customer__r.Billing_Contact_Email__c,
        Name, Total_Worked_Hour__c, Invoiced_Date__c, Invoiced_Amount__c,
        Invoiced__c, Invoice_Number__c, Friday_Hours__c, Thursday_Hours__c, Wednesday_Hours__c,
        Tuesday_Hours__c, Monday_Hours__c, Saturday_Hours__c, Sunday_Hours__c, Project_Name__c 
        FROM Time_Card__c WHERE Id = :timeCardId];
    if (!timeCardList.isEmpty()) {
        timeCard = timeCardList.get(0);
        billingAddress = String.valueOf(timeCard.Project_Assignment__r.Project__r.Customer__r.BillingAddress);
    }
  }
}