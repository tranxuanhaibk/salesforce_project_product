public with sharing class EmailComposerController {
    @AuraEnabled
    public static String sendEmailToRecipient(Id recipientId, String subject, String emailBody) {
        try {
            // Determine if the recipient is a Lead or a Contact
            String recipientType;
            String recipientEmail;
            
            Lead leadRecipient = [SELECT Email FROM Lead WHERE Id = :recipientId LIMIT 1];
            if (leadRecipient != null) {
                recipientType = 'Lead';
                recipientEmail = leadRecipient.Email;
            } else {
                Contact contactRecipient = [SELECT Email FROM Contact WHERE Id = :recipientId LIMIT 1];
                if (contactRecipient != null) {
                    recipientType = 'Contact';
                    recipientEmail = contactRecipient.Email;
                }
            }

            if (String.isNotBlank(recipientType)) {
                // Create and send the email
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setToAddresses(new String[] { recipientEmail });
                email.setSubject(subject);
                email.setPlainTextBody(emailBody);

                Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });

                if (results[0].isSuccess()) {
                    return 'Email sent successfully to ' + recipientType + '.';
                } else {
                    return 'An error occurred while sending the email: ' + results[0].getErrors()[0].getMessage();
                }
            } else {
                return 'Recipient not found or is neither a Lead nor a Contact.';
            }
        } catch (Exception e) {
            return 'An error occurred while sending the email: ' + e.getMessage();
        }
    }

    @AuraEnabled
    public static List<sObject> searchLeadsAndContacts(String searchTerm) {
        String searchQuery = '%' + searchTerm + '%';

        List<Lead> leads = [SELECT Id, Name FROM Lead WHERE Name LIKE :searchQuery LIMIT 10];
        List<Contact> contacts = [SELECT Id, Name FROM Contact WHERE Name LIKE :searchQuery LIMIT 10];

        List<sObject> results = new List<sObject>();
        results.addAll(leads);
        results.addAll(contacts);

        return results;
    }
}
