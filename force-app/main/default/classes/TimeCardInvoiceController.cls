public class TimeCardInvoiceController {

  public String timeCardId{get; set;}
  public Time_Card__c timeCard{get;set;}
  public String customerName {get;set;}
  public String customerContact {get;set;}
  public String customerEmail {get;set;}

  public String streetBillingAddress{get;set;}
  public String cityBillingAddress{get;set;}
  public String countryBillingAddress{get;set;}

  public String firstSplitDate{get;set;}
  public String lastSplitDate{get;set;}

  public TimeCardInvoiceController() {
    timeCardId = ApexPages.currentPage().getParameters().get('id');
    List<Time_Card__c> timeCardList = [SELECT 
        Id, Project_Assignment__r.Project__r.Customer__r.Name, Project_Assignment__r.Project__r.Customer__r.BillingAddress,
        Project_Assignment__r.Project__r.Customer__r.Billing_Contact_Name__c, Project_Assignment__r.Project__r.Customer__r.Billing_Contact_Email__c,
        Name, Total_Worked_Hour__c, Invoiced_Date__c, Invoiced_Amount__c,
        Invoiced__c, Invoice_Number__c, Friday_Hours__c, Thursday_Hours__c, Wednesday_Hours__c,
        Tuesday_Hours__c, Monday_Hours__c, Saturday_Hours__c, Sunday_Hours__c, Project_Name__c, Employee_Full_Name__c 
        FROM Time_Card__c WHERE Id = :timeCardId];

    if (!timeCardList.isEmpty()) {
      this.timeCard = timeCardList.get(0);
      this.customerName = String.valueOf(timeCard.Project_Assignment__r.Project__r.Customer__r.Name);
      this.customerContact = timeCard.Project_Assignment__r.Project__r.Customer__r.Billing_Contact_Name__c;
      this.customerEmail = timeCard.Project_Assignment__r.Project__r.Customer__r.Billing_Contact_Email__c;

      Address addr = timeCard.Project_Assignment__r.Project__r.Customer__r.BillingAddress;
      this.streetBillingAddress = addr.getStreet();
      this.cityBillingAddress = addr.getCity();
      this.countryBillingAddress = addr.getCountry();

      AggregateResult[] maxMinWorkDateResult = [SELECT MIN(Work_Date__c) minWorkDate, MAX(Work_Date__c) maxWorkDate FROM Time_Card_Split__c WHERE Time_Card__c = :timeCardId];
      if (!maxMinWorkDateResult.isEmpty()) {
        DateTime firstSplitDateTime = (DateTime) maxMinWorkDateResult[0].get('minWorkDate');
        DateTime lastSplitDateTime = (DateTime) maxMinWorkDateResult[0].get('maxWorkDate');

        this.firstSplitDate = (firstSplitDateTime + 1).format('dd/MM/yyyy');
        this.lastSplitDate = (lastSplitDateTime + 1).format('dd/MM/yyyy');
      }
    }
  }
}