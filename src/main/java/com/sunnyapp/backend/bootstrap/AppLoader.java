package com.sunnyapp.backend.bootstrap;


import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import com.sunnyapp.backend.services.PostsService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

@Component
public class AppLoader implements ApplicationListener<ContextRefreshedEvent> {


    @Autowired
    private PostsService postsService;

    private Logger log = Logger.getLogger(AppLoader.class);

    /*@Autowired
    public void setProductRepository(ProductRepositoryImpl productRepository) {
        this.productRepository = productRepository;
    }*/

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        //load admin
        loadFirebaseAdminOptions();
    }


    private void loadFirebaseAdminOptions() {
        FileInputStream serviceAccount = null;
        try {
            serviceAccount = new FileInputStream("./src/main/resources/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                .setDatabaseUrl("https://friendlypix-d292b.firebaseio.com")
                .build();

        FirebaseApp.initializeApp(options);

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
}
