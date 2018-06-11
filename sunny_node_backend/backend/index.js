/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// [START imports]
var firebase = require('firebase-admin');
// [END imports]
var schedule = require('node-schedule');
var Promise = require('promise');

var cron = require('node-cron');




// TODO(DEVELOPER): Configure your email transport.
// Configure the email transport using the default SMTP transport and a GMail account.
// See: https://nodemailer.com/
// For other types of transports (Amazon SES, Sendgrid...) see https://nodemailer.com/2-0-0-beta/setup-transporter/

var fs = require('fs')
var expandHomeDir = require('expand-home-dir')//help to read from home path in linux filesystem

var serviceAccount ;//= require('./../firebase.json');
const Storage = require('@google-cloud/storage');
//var gcloud = require('@google-cloud');
var gcs ;//
var bucket;//
var app_id ='friendlypix-d292b';
var CLOUD_BUCKET = app_id;//config.get('CLOUD_BUCKET');
var env = 'stg';
var profileImagesLocalPath = 'profile_images/';


var upload_resources_service = require('./upload-resources/index');
// print process.argv
/*process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});*/
if(process.argv[2]!=null){
    env = process.argv[2];
}

if(process.argv[3]!=null){
    app_id = process.argv[3];
    CLOUD_BUCKET = app_id+'.appspot.com';
}

//return;
var homePath = expandHomeDir('~/dev/private_keys/'+env+'/pk.json');
var buildServiceAccountPath = function() {
    var promise = new Promise(function(resolve, reject){
        fs.readFile(homePath, 'utf8', function (err, data) {
            if (err) {
                reject(console.log(err));
            }

            console.log("loaded cred json from file system")
            resolve({data: data});
        });
    });
    return promise;
};


var loadServiceAccountPath = function(firebaseCredResults) {
    var promise = new Promise(function(resolve, reject){
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(JSON.parse(firebaseCredResults.data)),
                databaseURL: 'https://'+app_id+'.firebaseio.com'
            });
        }

        gcs = Storage({
            projectId: app_id,
            keyFilename: homePath
        });
         bucket = gcs.bucket(CLOUD_BUCKET);


        //is fire loaded? if not stop the process
        if(firebase.apps.length ) {
            console.log("firebase loaded");
            resolve("foo")
        }
        else {
            console.log("failed to load firebase");
            reject(process.exit())
        }
      /*  bucket.upload(profileImagesLocalPath+'foo.txt', function(err, file) {
            if (err)
                throw new Error(err);
        });*/
    });
    return promise;
};

// Get a database reference to our posts




var HOUR_IN_MILLI_SECONDS = 60 * 60 * 1000*1
var scheduleDeletionPosts = function() {
    var promise = new Promise(function(resolve, reject){
        var db = firebase.database();
        var ref = db.ref("/posts_meta/").orderByChild("delete").equalTo(false);

        cron.schedule('* * * * *', function(){
            console.log('running a schedule every hour');

        ref.on("child_added", function(snapshot, prevChildKey) {
            var postMeta = snapshot.val();


            console.log("postMeta.timestamp: " + postMeta.timestamp + "real date : " + new Date(postMeta.timestamp));
            console.log("postMeta.ttl: " + postMeta.ttl);

            if(postMeta.timestamp + postMeta.ttl*HOUR_IN_MILLI_SECONDS  < Date.now()){
                console.log("postId: "+snapshot.key+" should be deleted");
                snapshot.ref.child("delete").set(true);
            }
            else{
                console.log("postId: "+snapshot.key+" should  not be deleted");

            }
        });
            resolve("start schedule for deletion messages")
        });
    });
    return promise;
};

var scheduleDeletionMessages = function() {
    var promise = new Promise(function(resolve, reject){
        var db = firebase.database();
        var ref = db.ref("/chats/messages-meta/").orderByChild("delete").equalTo(false);

        cron.schedule('* * * * *', function(){
            console.log('running a schedule every hour');

            ref.on("child_added", function(snapshot, prevChildKey) {
                var messageMeta = snapshot.val();


                console.log("messageMeta.timestamp: " + messageMeta.timestamp + "real date : " + new Date(messageMeta.timestamp));
                console.log("messageMeta.ttl: " + messageMeta.ttl);

                if(messageMeta.timestamp + messageMeta.ttl*HOUR_IN_MILLI_SECONDS  < Date.now()){
                    console.log("messageId: "+snapshot.key+" should be deleted");
                    snapshot.ref.child("delete").set(true);
                }
                else{
                    console.log("messagetId: "+snapshot.key+" should  not be deleted");

                }
            });
        });
    });
    return promise;
};

var triggerUpload = function (){
    upload_resources_service.uploadResources(firebase,bucket)
}
var loadResources = false;
if(process.argv[4]!=null){
    loadResources = (process.argv[4] === 'true');
}
if(loadResources){
    buildServiceAccountPath()
    .then(loadServiceAccountPath)
    .then(triggerUpload);
}
buildServiceAccountPath()
    .then(loadServiceAccountPath)
    .then(scheduleDeletionPosts);

buildServiceAccountPath()
    .then(loadServiceAccountPath)
    .then(scheduleDeletionMessages);
   // .then(uploadProfileImagesThumb);

    //.then(uploadProfileImagesThumb);
return;

