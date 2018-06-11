package com.sunnyapp.backend.utils;/*
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




import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class FirebaseUtil {
    public static DatabaseReference getBaseRef() {
        return FirebaseDatabase.getInstance().getReference();
    }



    /*public static void setCurrentUserName() {
        FirebaseUser uid = FirebaseAuth.getInstance().getCurrentUser();
        if (uid == null) return null;

    }*/


    public static DatabaseReference getPostsRef() {
        return getBaseRef().child("posts");
    }

    public static String getPostsPath() {
        return "posts/";
    }

    public static DatabaseReference getPostsMapRef() {
        return getBaseRef().child("posts_map");
    }

    public static String getPostsMapPath() {
        return "posts_map/";
    }

    public static DatabaseReference getPostsDeletionRef() {
        return getBaseRef().child("posts_to_delete");
    }

    public static String getPostsDeletionPath() {
        return "posts_to_delete/";
    }

    public static DatabaseReference getPostViewsRef(String postId){
        return getPostsRef().child(postId).child("views");
    }

    public static String getMessagesPath() {
        return "chats/messages/";
    }

    public static DatabaseReference getMessagesRef() {
        return getBaseRef().child("chats").child("messages");
    }

    public static String getMessagesMetaPath() {
        return "chats/messages-meta/";
    }

    public static DatabaseReference getMessagesMetaRef() {
        return getBaseRef().child("chats").child("messages-meta");
    }

    public static String getConversationsPath() {
        return "chats/conversations/";
    }

    public static DatabaseReference getConversationsRef() {
        return getBaseRef().child("chats").child("conversations");
    }

    public static String getMembersPath() {
        return "chats/members/";
    }

    public static DatabaseReference getMembersRef() {
        return getBaseRef().child("chats").child("members");
    }


    public static DatabaseReference getChatsByMamberRef(String userId) {
        return getBaseRef().child("chats").child("members").child(userId);
    }


    public static String getUsersPath() {
        return "users/";
    }

    public static String getPostsMapPerUserPath(String userId) { //todo add rules in db
        return "posts_map/users/"+userId;
    }

    public static DatabaseReference getPostsMapPerUserRef(String userId) {
        return getPostsMapRef().child("users").child(userId);
    }

    public static DatabaseReference getUsersRef() {
        return getBaseRef().child("users");
    }

    public static DatabaseReference getUserRefById(String userId) {
        return getBaseRef().child("users").child(userId);
    }

    public static DatabaseReference getUserPostRefById(String userId) {
        return getBaseRef().child("users").child(userId).child("posts");
    }

    public static DatabaseReference getCommentsRef() {
        return getBaseRef().child("comments");
    }

    public static DatabaseReference getFeedRef() {
        return getBaseRef().child("feed");
    }

    public static DatabaseReference getLikesRef() {
        return getBaseRef().child("likes");
    }

    public static DatabaseReference getFollowersRef() {
        return getBaseRef().child("followers");
    }

    public static DatabaseReference getCurrentUserFollowingsRef(String userId) {
        return getFollowersRef().child(userId ).child("following");
    }

    public static DatabaseReference getCurrentUserFollowersRef(String userId) {
        return getFollowersRef().child(userId ).child("followers");
    }

    public static String getCurrentUserFollowingsPath(String userId) {
        return getFollowersPath() + userId  + "/" + "following/";
    }

    public static String getCurrentUserFollowersPath(String userId) {
        return getFollowersPath() + userId + "/" + "followers/";
    }

    public static DatabaseReference getSpecificUserFollowingsRef(String userID) {
        return getFollowersRef().child(userID).child("following");
    }

    public static DatabaseReference getSpecificUserFollowersRef(String userID) {
        return getFollowersRef().child(userID).child("followers");
    }

    public static String getSpecificUserFollowingsPath(String userID) {
        return getFollowersPath() + userID + "/" + "following/";
    }

    public static String getSpecificUserFollowersPath(String userID) {
        return getFollowersPath() + userID + "/" + "followers/";
    }

    public static String getFollowersPath() {
        return "followers/";
    }

}
