public without sharing class AddPrimaryContact implements Queueable {
    private String state;
    private Contact contact;

    public AddPrimaryContact(Contact contact, String state) {
        this.contact = contact;
        this.state = state;
    }
 
    public void execute(QueueableContext context) {
        // Retrievi Accout
        List<Account> accountList = [SELECT Id, BillingState FROM Account WHERE BillingState = :state LIMIT 200];
        List<Contact> contactList = new List<Contact>();
        for (Account account : accountList) {
            Contact contactClone = contact.clone();
            contactClone.AccountId = account.Id;
            contactList.add(contactClone);
        }
        insert contactList;
    }
}