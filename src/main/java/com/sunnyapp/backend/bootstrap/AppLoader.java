package com.sunnyapp.backend.bootstrap;


import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.sunnyapp.backend.configuration.GCPConfiguration;
import com.sunnyapp.backend.services.PostsService;
import com.sunnyapp.backend.utils.Utils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
public class AppLoader implements ApplicationListener<ContextRefreshedEvent> {


    @Autowired
    private PostsService postsService;


    private Logger log = Logger.getLogger(AppLoader.class);

    @Autowired
    GCPConfiguration.FirebaseCred firebaseCred;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        //load adminv
        loadFirebaseAdminOptions();
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

    private void loadFirebaseAdminOptions() {
        InputStream serviceAccount = null;
        InputStream serviceAccount1 = null;

        // serviceAccount = getResource("friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
        // try {
        try {
            //serviceAccount = new FileInputStream("./src/main/resources/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
            // serviceAccount = new FileInputStream(new File(System.getProperty("user.home")+"/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json"));
            serviceAccount = new FileInputStream(firebaseCred.getCredFile());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        //serviceAccount = getResource("friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");


        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                .setDatabaseUrl("https://friendlypix-d292b.firebaseio.com")
                .build();

        FirebaseApp.initializeApp(options);
        postsService.startMarkPostToDeletionService();

      /*  FirebaseOptions options = null;
        try {
            options = new FirebaseOptions.Builder()
                    .setServiceAccount(
                            new FileInputStream("./src/main/resources/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json"))
                    .setDatabaseUrl("https://friendlypix-d292b.firebaseio.com")
                    .build();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        FirebaseApp.initializeApp(options);*/
    }

   /* private InputStream getResource(String fileName) {
        ClassLoader cl = this.getClass().getClassLoader();
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);
        try {
            return resolver.getResources("classpath*:/" + fileName)[0].getInputStream();
        } catch (IOException e) {
            log.error("cant load " + fileName);
            e.printStackTrace();
        }
        return null;
    }*/

}
