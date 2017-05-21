package com.sunnyapp.backend.domain;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by yarink on 21/05/2017.
 */
public class PostDeletionData {

    @Getter
    @Setter
    String postDataPath;

    @Getter
    @Setter
    String postDataStoragePath;


    @Getter
    @Setter
    String uid;

    @Getter
    @Setter
    String tags;

    public PostDeletionData(){

    }
    public PostDeletionData(String postDataPath ,String postDataStoragePath, String uid, String tags) {
        this.postDataPath = postDataPath;
        this.postDataStoragePath=postDataStoragePath;
        this.uid = uid;
        this.tags=tags;

    }

}
