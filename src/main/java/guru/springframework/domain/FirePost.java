/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package guru.springframework.domain;


public class FirePost {

    public enum PostMediaType {
        VIDEO("video"), IMAGE("image");
        String value;

        PostMediaType(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return value;
        }
    }

    private Author author;
    private String full_url;
    private String thumb_storage_uri;
    private String thumb_url;
    private String text;
    private Object timestamp;


    private String postType;
    private String postMediaType;

    private String coverImageUrl;

    private String location = " ";

    private String base_storage_uri_path;



    private int time_zone;

    private int views;

    private int ttl;

    public int getTtl() {
        return ttl;
    }

    public String getBase_storage_uri_path() {
        return base_storage_uri_path;
    }

    public void setBase_storage_uri_path(String base_storage_uri_path) {
        this.base_storage_uri_path = base_storage_uri_path;
    }

    public void setTtl(int ttl) {
        this.ttl = ttl;
    }

    public String getPostType() {
        return postType;
    }

    public void setPostType(String postType) {
        this.postType = postType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    public int getViews() {
        return views;
    }

    public int getTime_zone() {
        return time_zone;
    }

    public void setTime_zone(int time_zone) {
        this.time_zone = time_zone;
    }

    public FirePost() {
        // empty default constructor, necessary for Firebase to be able to deserialize  posts
    }

    /*public FirePost(Author author, String full_url, String full_storage_uri, String thumb_url, String thumb_storage_uri, String text, Object timestamp, String postMediaType) {
        this.author = author;
        this.full_url = full_url;
        this.text = text;
        this.timestamp = timestamp;
        this.thumb_storage_uri = thumb_storage_uri;
        this.thumb_url = thumb_url;
        this.full_storage_uri = full_storage_uri;
        this.postMediaType = postMediaType;
        this.views = 0;
    }*/

    public FirePost(Author author,final String baseStoragePath,String postType, Object timestamp, int time_zone,int ttl, String full_url, String text, String postMediaType, String thumb_url, String thumb_storage_uri, String coverImageUrl) {
        this(author,baseStoragePath,postType, timestamp, time_zone,ttl, full_url, text, postMediaType, thumb_url, thumb_storage_uri);
        this.coverImageUrl = coverImageUrl;
    }

    //video post without cover
    public FirePost(Author author,final String baseStoragePath,String postType, Object timestamp, int time_zone, int ttl,String full_url, String text, String postMediaType, String thumb_url, String thumb_storage_uri) {
        this.author = author;
        this.base_storage_uri_path=baseStoragePath;
        this.full_url = full_url;
        this.text = text;
        this.timestamp = timestamp;
        this.postType = postType;
        this.postMediaType = postMediaType;
        this.thumb_storage_uri = thumb_storage_uri;
        this.thumb_url = thumb_url;
        this.time_zone = time_zone;
        this.ttl=ttl;
        this.views = 0;
    }

    public Author getAuthor() {
        return author;
    }

    public String getFull_url() {
        return full_url;
    }

    public String getText() {
        return text;
    }

    public Object getTimestamp() {
        return timestamp;
    }

    public String getThumb_storage_uri() {
        return thumb_storage_uri;
    }

    // @JsonProperty("thumb_url") todo resolve
    public String getThumb_url() {
        return thumb_url;
    }


    public String getPostMediaType() {
        return postMediaType;
    }

    /*public boolean isVideoType() {
        return postMediaType.equals(PostMediaType.VIDEO.toString());
    }*/

    public void setPostMediaType(String postMediaType) {
        this.postMediaType = postMediaType;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }
}
