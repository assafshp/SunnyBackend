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



    private void loadFirebaseAdminOptions() {
        InputStream serviceAccount = null;

        try {
            log.info("is firecred exits : "+firebaseCred.getCredFile().exists());
            serviceAccount = new FileInputStream(firebaseCred.getCredFile());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }


        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                .setDatabaseUrl("https://friendlypix-d292b.firebaseio.com")
                .build();

        FirebaseApp.initializeApp(options);
        //postsService.startMarkPostToDeletionService();

    }
}
