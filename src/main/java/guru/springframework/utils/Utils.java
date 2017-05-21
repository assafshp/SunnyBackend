package guru.springframework.utils;

/**
 * Created by yarink on 18/05/2017.
 */
public class Utils {

    public static String storagePathBuilder(String... pathToAppend) {
        StringBuilder stringBuilder = new StringBuilder();
        for (String path : pathToAppend) {
            stringBuilder.append(path);
            stringBuilder.append("/");
        }
        return stringBuilder.deleteCharAt(stringBuilder.length() - 1).toString();
    }

}
