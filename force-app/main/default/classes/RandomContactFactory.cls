public class RandomContactFactory {
    public static List<Contact> generateRandomContacts(Integer numberOfContact, String lastName) {
        List<Contact> contactList = new List<Contact>();
        for (Integer i = 0; i < numberOfContact; i++) {
            Contact contact = new Contact(Firstname = 'Test ' + i, Lastname = lastName);
            contactList.add(contact);
        }
        return contactList;
    }
}