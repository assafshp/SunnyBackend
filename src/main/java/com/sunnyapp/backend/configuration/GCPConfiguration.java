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

    // @Value(value = "classpath*:/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json")
    // private Resource companiesXml;
    @Autowired
    FirebaseCred firebaseCred;

    @Bean
    public Storage getStorage() throws IOException {
        InputStream serviceAccount = null;
        //    companiesXml.getFile();
        //getResource("friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
        //serviceAccount = getResource("friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
        //serviceAccount = new FileInputStream(new File(System.getProperty("user.home") + "/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json"));
        serviceAccount = new FileInputStream(firebaseCred.getCredFile());

        //getResource("friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
        return StorageOptions.newBuilder().setCredentials(GoogleCredentials.fromStream(serviceAccount)).build().getService();
    }


    @Bean
    public FirebaseCred getFireBaseCred() {
        return new FirebaseCred().setFirebseCred(new File(System.getProperty("user.home") + "/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json"));
    }


    public InputStream getResource(String fileName) {
        ClassLoader cl = this.getClass().getClassLoader();
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);
        try {
            return resolver.getResources("classpath*:/" + fileName)[0].getInputStream();
        } catch (IOException e) {
            log.error("cant load " + fileName);
            e.printStackTrace();
        }
        return null;
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
