@IsTest
global class ParkServiceMock implements WebServiceMock {
    global void doInvoke(Object stub, Object request, Map<String, Object> response, String endpoint,
        String soapAction, String requestName, String responseNs, String responseName, String responseType) {
        ParkService.byCountryResponse response_x = new ParkService.byCountryResponse();
        response_x.return_x = new List<String>{'Yosemite', 'Sequoia', 'Crater Lake'};
        response.put('response_x', response_x);
    }
}