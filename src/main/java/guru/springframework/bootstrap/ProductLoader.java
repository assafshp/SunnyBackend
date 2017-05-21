package guru.springframework.bootstrap;


import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseCredentials;
import guru.springframework.services.PostsService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileNotFoundException;

@Component
public class ProductLoader implements ApplicationListener<ContextRefreshedEvent> {


    @Autowired
    private PostsService postsService;

    private Logger log = Logger.getLogger(ProductLoader.class);

    /*@Autowired
    public void setProductRepository(ProductRepositoryImpl productRepository) {
        this.productRepository = productRepository;
    }*/

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        //load admin
        loadFirebaseAdminOptions();
        //postsService.startMarkPostToDeletionService();
       // postsService.startDeletePostsService();
       /* if (true) return;
        Query query = FirebaseUtil.getPostsRef().orderByChild("text").equalTo("TestPost");
        query.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                int a = 6;
                // dataSnapshot.getRef().removeValue();
                //((H.ashMap)dataSnapshot.getValue()).get("text");
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                int a = 6;
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {

            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {

            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });*/
        // the rest of the code remains the same as above

      /*  Product shirt = new Product();
        shirt.setDescription("Spring Framework Guru Shirt");
        shirt.setPrice(new BigDecimal("18.95"));
        shirt.setImageUrl("https://springframework.guru/wp-content/uploads/2015/04/spring_framework_guru_shirt-rf412049699c14ba5b68bb1c09182bfa2_8nax2_512.jpg");
        shirt.setProductId("235268845711068308");
        productRepository.save(shirt);

        log.info("Saved Shirt - id: " + shirt.getId());

        Product mug = new Product();
        mug.setDescription("Spring Framework Guru Mug");
        mug.setImageUrl("https://springframework.guru/wp-content/uploads/2015/04/spring_framework_guru_coffee_mug-r11e7694903c348e1a667dfd2f1474d95_x7j54_8byvr_512.jpg");
        mug.setProductId("168639393495335947");
        mug.setPrice(new BigDecimal("11.95"));
        productRepository.save(mug);

        log.info("Saved Mug - id:" + mug.getId());*/
    }

    /*private void loadGoogleCloudStorage() throws IOException {

        FileInputStream serviceAccount = null;
        try {
            serviceAccount = new FileInputStream("./src/main/resources/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        Storage storage = StorageOptions.newBuilder().setCredentials(GoogleCredentials.fromStream(serviceAccount)).build().getService();
        String bucketName = "friendlypix-d292b.appspot.com";
        Bucket bucket = storage.get(bucketName);
        Blob giraffeBlob = storage.get(bucketName, "gs://friendlypix-d292b.appspot.com/users_uploads/posts/-KizpatDM65dF-vlWgw7/18578df57feb25902215acb0d89c484e.jpg", null);

        storage.delete(BlobId.of(bucketName,"users_uploads/posts/-KizpatDM65dF-vlWgw7/18578df57feb25902215acb0d89c484e.jpg"));
        int a = 6;
       *//* FileInputStream serviceAccount = null;
        //gs://friendlypix-d292b.appspot.com/users_uploads/posts/-KizpatDM65dF-vlWgw7/18578df57feb25902215acb0d89c484e.jpg
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredential(FirebaseCredentials.fromCertificate(serviceAccount))
                .setDatabaseUrl("https://friendlypix-d292b.firebaseio.com")
                .build();
        Storage storage = StorageOptions.newBuilder().setCredentials()
                .authCredentials(options)
                        .build()
                        .service();*//*
       *//* Storage storage = StorageOptions.getDefaultInstance().getService();
        String bucketName = "friendlypix-d292b.appspot.com";
        Bucket bucket = storage.get(bucketName);
      *//*  //storage.de


    }*/

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
