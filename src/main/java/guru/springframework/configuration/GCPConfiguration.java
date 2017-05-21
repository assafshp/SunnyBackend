package guru.springframework.configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

/**
 * Created by yarink on 18/05/2017.
 */
@Configuration
public class GCPConfiguration {

    @Bean
    public Storage getStorage() throws IOException {
        FileInputStream serviceAccount = null;
        try {
            serviceAccount = new FileInputStream("./src/main/resources/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return  StorageOptions.newBuilder().setCredentials(GoogleCredentials.fromStream(serviceAccount)).build().getService();
    }

}
