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
var escape = require('escape-html');

// TODO(DEVELOPER): Configure your email transport.
// Configure the email transport using the default SMTP transport and a GMail account.
// See: https://nodemailer.com/
// For other types of transports (Amazon SES, Sendgrid...) see https://nodemailer.com/2-0-0-beta/setup-transporter/

var fs = require('fs')
/*var expandHomeDir = require('expand-home-dir')//help to read from home path in linux filesystem

var serviceAccount ;//= require('./../firebase.json');
const Storage = require('@google-cloud/storage');
//var gcloud = require('@google-cloud');
var gcs ;//
const CLOUD_BUCKET = 'friendlypix-d292b.appspot.com';//config.get('CLOUD_BUCKET');*/
var bucket;//
var profileImagesLocalPath = 'upload-resources/sun_profile_images/';
var profileImagesRemotePath = 'profile_images/';

 async function upload_resources(pFirebase,pBucket){
     firebase=pFirebase;
     bucket = pBucket;
    await console.log("start upload_resources");
    await uploadProfileImagesFull('1001');
    await uploadProfileImagesFull('1002');
    await uploadProfileImagesFull('1003');
    await uploadProfileImagesFull('1004');
    await uploadProfileImagesFull('1005');
    await uploadProfileImagesFull('1006');
    await uploadProfileImagesFull('1007');
    await uploadProfileImagesFull('1008');
    await uploadProfileImagesFull('1009');
    return;
}

var uploadProfileImagesFull =async function(index) {
     var uploadFiles= new Promise(function(resolve, reject){


        var fullImagesPath = profileImagesLocalPath+'full/';
        var file = index+".png";

       // fs.readdirSync(fullImagesPath ).forEach(file => {
            console.log('profileIamge full detected :'+file);
        //https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/0.8.0/storage/bucket?method=upload
        var destInStorage =  profileImagesRemotePath+'full'+file;
        var options = {
            destination: destInStorage ,

        };
          bucket.upload(fullImagesPath +file,options, function(err, uploadedFile) {

            if (err)
                throw new Error(err);
            else{
                uploadedFile.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then(signedUrls => {
                    var fileIndex = file;
                var signedUrlFull= signedUrls[0];

                   uploadProfileImagesThumb({file:file ,
                       index:index,
                        signedUrlFull:signedUrlFull,
                    destInStorageFull:destInStorage
                }).then(updateFirebaseDB).then(resolve());
                  //resolve();
            });

        }
    });
   // });
})
    return uploadFiles;

}

/*
var options = {
    destination: 'new-image.png',
    resumable: true,
    validation: 'crc32c',
    metadata: {
        metadata: {
            event: 'Fall trip to the zoo'
        }
    }
};*/

var uploadProfileImagesThumb =  function(object) {
    var uploadFiles = new Promise(function(resolve, reject){

        var thumbImagesPath = profileImagesLocalPath+'thumb/';
       // fs.readdirSync(thumbImagesPath).forEach(file => {
            //console.log('profileIamge thumb detected :'+file);
        var fileToUpload = object.file;
        var index = object.index;
    var destInStorage =  profileImagesRemotePath+'thumb'+fileToUpload;
    var options = {
            destination: destInStorage ,

        };
        bucket.upload(thumbImagesPath +fileToUpload ,options, function(err, uploadedFile) {
            if (err)
                throw new Error(err);
            else{
                uploadedFile.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then(signedUrls => {

                var fileIndex = fileToUpload ;
                var signedUrlThumb= signedUrls[0];
                object.file=fileToUpload;
                object.signedUrlThumb=signedUrlThumb;
                object.destInStorageThumb=destInStorage;
                object.index =index ;
                resolve(object);

                //resolve(object);
            });

            }
        });
    //});
    })
    return uploadFiles;

}






var updateFirebaseDB =function updateFirebaseDB(object){


    return new Promise(resolve => {



    var appConfigurationRef = firebase.database().ref('app_configuration');
    var profileImageFirebaseRef = appConfigurationRef.child('profile_images');
    var firebaseUpdate = profileImageFirebaseRef.push();
    var update = {
        'file' : object.file,
        'index' : object.index,
        'signedUrlThumb' : object.signedUrlThumb,
        'signedUrlFull' : object.signedUrlFull,
        'destInStorageFull' : object.destInStorageThumb,
        'destInStorageThumb' : object.destInStorageFull
    };
    console.log(update);
    firebaseUpdate.update(update,function (err) {
        if(err){
            console.log("can't update firebase about new image profile loaded ")

        }
        else{
            console.log("success to update firebase about new image profile loaded ")
            resolve('foobar');

        }
    });
});
}



module.exports = {
    uploadResources: upload_resources,
    test: function() {
        console.log('var is', this.firebase);
    }
};