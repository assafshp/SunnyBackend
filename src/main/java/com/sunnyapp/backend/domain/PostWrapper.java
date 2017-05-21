package com.sunnyapp.backend.domain;

import lombok.Getter;




public class PostWrapper<T extends Object> implements java.io.Serializable{
    @Getter
    String key;
    @Getter
    T firePost;

    public PostWrapper(String key, T firePost) {
        this.key = key;
        this.firePost = firePost;
    }

    public Class<?> instanceOf(){
        return firePost.getClass();
    }

    public boolean equals(Object obj) {
        if (obj == null) return false;
        if (obj == this) return true;
        if (!(obj instanceof PostWrapper)) return false;
        PostWrapper o = (PostWrapper) obj;
        return o.key.equals(this.getKey());
    }


}