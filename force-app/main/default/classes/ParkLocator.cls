public class ParkLocator {
    public static List<String> country(String country) {
        ParkService.ParksImplPort parkServ = new ParkService.ParksImplPort();
        return parkServ.byCountry(country);
    }
}