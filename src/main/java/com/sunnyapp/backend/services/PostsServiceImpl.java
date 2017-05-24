package com.sunnyapp.backend.services;

import com.google.api.gax.paging.Page;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.Storage;
import com.google.firebase.database.*;
import com.google.firebase.internal.NonNull;
import com.google.firebase.tasks.OnCompleteListener;
import com.google.firebase.tasks.Task;
import com.sunnyapp.backend.bootstrap.AppLoader;
import com.sunnyapp.backend.domain.PostWrapper;
import com.sunnyapp.backend.utils.FirebaseUtil;
import com.sunnyapp.backend.domain.FirePost;
import com.sunnyapp.backend.domain.PostDeletionData;
import com.sunnyapp.backend.utils.CustomDateUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@EnableScheduling
public class PostsServiceImpl implements PostsService {

    private Logger log = Logger.getLogger(AppLoader.class);
    private long MILLI_SECONDS_IN_HOUR = 3600000;
    @Autowired
    private Storage storage;
    private static int HOUR_IN_MILLI_SECONDS = 60 * 60 * 1000;
    ;
    private static int MINUTE_IN_MILLI_SECONDS = 60 * 1000;
    String bucketName = "friendlypix-d292b.appspot.com";


    ChildEventListener deletionPostListener;
    ChildEventListener markPostToDeletion;

    @Override
    @Scheduled(cron = "0 0 * * * *")
    public void startMarkPostToDeletionService() {
        log.info("startMarkPostToDeletionService by cron expression");
        DatabaseReference databaseReference = FirebaseUtil.getPostsRef();
        markPostToDeletion = new ChildEventListener() {


            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                log.info("check if post key : " + dataSnapshot.getKey() + " should be marked as deleted");
                PostWrapper firePostWrapper = new PostWrapper(dataSnapshot.getKey(), dataSnapshot.getValue(FirePost.class));
                String postDataPath = dataSnapshot.getRef().getPath().toString();
                FirePost firePost = (FirePost) firePostWrapper.getFirePost();
                int ttl = firePost.getTtl();
                //if (((Long) firePost.getTimestamp() + Integer.toUnsignedLong( ttl* HOUR_IN_MILLI_SECONDS)) < CustomDateUtils.getCurrentTimestamp())
                if (((Long) firePost.getTimestamp() + Integer.toUnsignedLong(/*ttl **/ HOUR_IN_MILLI_SECONDS)) < CustomDateUtils.getCurrentTimestamp()) {
                    markPostToDelete(dataSnapshot.getKey(), firePost, postDataPath);
                    log.info("start mark for deletion post key : " + dataSnapshot.getKey());
                } else {
                    log.info("post key : " + dataSnapshot.getKey() + " should not be marked as deleted");
                }

            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {

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
        };
        databaseReference.removeEventListener(markPostToDeletion);
        databaseReference.addChildEventListener(markPostToDeletion);
    }


    @Override
    @Scheduled(cron = "0 0 * * * *")
    public void startDeletePostsService() {
        log.info("startDeletePostsService by cron expression");
        DatabaseReference databaseReference = FirebaseUtil.getPostsDeletionRef();
        deletionPostListener = new ChildEventListener() {


            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
                log.info("start perform deletion of post key : " + dataSnapshot.getKey());
                PostDeletionData deletionData = dataSnapshot.getValue(PostDeletionData.class);
                String postKey = dataSnapshot.getKey();
                removePostUerRef(postKey, deletionData.getUid());
                removePostData(postKey, deletionData.getUid());
                removePostResources(deletionData.getPostDataStoragePath());
                dataSnapshot.getRef().removeValue();


            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {

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
        };
        databaseReference.removeEventListener(deletionPostListener);
        databaseReference.addChildEventListener(deletionPostListener);
    }

    private void markPostToDelete(String postKey, FirePost post, String postDataPath) {
        final DatabaseReference ref = FirebaseUtil.getBaseRef();
        Map<String, Object> updatedUserData = new HashMap<>();
        updatedUserData.put(FirebaseUtil.getPostsDeletionPath() + "/"  // just tag post/message on the uid node //todo in case of message type we dont use it
                + postKey, new PostDeletionData(postDataPath, post.getBase_storage_uri_path(), post.getAuthor().getUid(), null));
        ref.updateChildren(updatedUserData, new DatabaseReference.CompletionListener() {
            @Override
            public void onComplete(DatabaseError firebaseError, DatabaseReference databaseReference) {
                if (firebaseError == null) {
                    log.info("post with key : " + postKey + " were added to deletion list");

                } else {
                    log.error("failed to add post with key : " + postKey + " to deletion list");
                }
            }
        });
    }


    private void removePost(DataSnapshot dataSnapshot) {
        dataSnapshot.getRef().removeValue().addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {

            }
        });
    }

    private void removePostData(String postKeyToDelete, String uid) {
        Query queryToDelete = FirebaseUtil.getPostsRef().child(postKeyToDelete);

        queryToDelete.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                log.info(" post deletion " + dataSnapshot.getKey());
                dataSnapshot.getRef().removeValue();


            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                log.error("onCancelled post deletion", databaseError.toException());
            }
        });
    }

    private void removePostUerRef(String postKeyToDelete, String uid) {
        //lets remove to key from the users scheme

        FirebaseUtil.getPostsMapPerUserRef(uid).child(postKeyToDelete).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                dataSnapshot.getRef().removeValue();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });

    }

    private void removePostResources(String baseStoragePath) {
        Page<Blob> blobPage = storage.list(bucketName, Storage.BlobListOption.prefix(baseStoragePath));
        List<BlobId> blobIdList = new LinkedList<>();
        for (Blob blob : blobPage.iterateAll()) {
            blobIdList.add(blob.getBlobId());
            storage.delete(blob.getBlobId());
        }
        blobIdList.size();
    }

   /* protected String storagePathBuilder(String postType,String newPostKey ){
        return Utils.storagePathBuilder(postType.toString(), newPostKey);
    }*/
}
