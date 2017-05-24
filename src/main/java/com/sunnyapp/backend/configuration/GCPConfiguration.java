package com.sunnyapp.backend.configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import lombok.Getter;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;

import java.io.*;

/**
 * Created by yarink on 18/05/2017.
 */
@Configuration
public class GCPConfiguration {
    private Logger log = Logger.getLogger(GCPConfiguration.class);

    @Autowired
    FirebaseCred firebaseCred;

    String projectId= "friendlypix-d292b";

    @Bean
    public Storage getStorage() throws IOException {
        InputStream serviceAccount = null;
       serviceAccount = new FileInputStream(firebaseCred.getCredFile());
        log.info("is firecred exits : "+firebaseCred.getCredFile().exists());
        return StorageOptions.newBuilder().setProjectId(projectId).setCredentials(GoogleCredentials.fromStream(serviceAccount)).build().getService();
    }


    @Bean
    public FirebaseCred getFireBaseCred() {
        return new FirebaseCred().setFirebseCred(new File(System.getProperty("user.home") + "/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json"));
    }


    public class FirebaseCred {

        @Getter
        File credFile;

        FirebaseCred() {

        }

        public FirebaseCred setFirebseCred(File credFile) {
            this.credFile = credFile;
            return this;
        }

    }

}
