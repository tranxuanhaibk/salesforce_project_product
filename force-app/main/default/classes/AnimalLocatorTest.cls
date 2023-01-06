@IsTest
private class AnimalLocatorTest {

    @IsTest
    static void getAnimalNameByIdTest() {
		Test.setMock(HttpCalloutMock.class, new AnimalLocatorMock());
		String actual = AnimalLocator.getAnimalNameById(5);  
        String expected = 'moose';
        System.assertEquals(expected, actual);
    }

}