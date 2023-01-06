@isTest
private class TestVerifyDate {
    @isTest
    static void testCheckDates1() {
        Date date1 = Date.newInstance(2022, 06, 09);
        Date date2 = Date.newInstance(2022, 07, 09);
        Date result = VerifyDate.CheckDates(date1, date2);
    }
    
    @isTest
    static void testCheckDates2() {
        Date date1 = Date.newInstance(2022, 07, 08);
        Date date2 = Date.newInstance(2022, 07, 09);
        Date result = VerifyDate.CheckDates(date1, date2);
    }
}