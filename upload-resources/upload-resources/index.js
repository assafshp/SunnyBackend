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
var expandHomeDir = require('expand-home-dir')//help to read from home path in linux filesystem

var serviceAccount ;//= require('./../firebase.json');
const Storage = require('@google-cloud/storage');
//var gcloud = require('@google-cloud');
var gcs ;//
var bucket;//
const CLOUD_BUCKET = 'friendlypix-d292b.appspot.com';//config.get('CLOUD_BUCKET');
var profileImagesLocalPath = 'profile_images/';



//return;
var homePath = expandHomeDir('~/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json');
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
                databaseURL: 'https://friendlypix-d292b.firebaseio.com'
            });
        }

        gcs = Storage({
            projectId: 'friendlypix-d292b',
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
var uploadProfileImagesFull = function(someStuff) {
    var uploadFiles= new Promise(function(resolve, reject){


        var fullImagesPath = profileImagesLocalPath+'full/';


        fs.readdirSync(fullImagesPath ).forEach(file => {
            console.log('profileIamge full detected :'+file);
        //https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/0.8.0/storage/bucket?method=upload
        var destInStorage =  fullImagesPath+file;
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
                        signedUrlFull:signedUrlFull,
                    destInStorageFull:destInStorage
                });
            });

        }
    });
    });
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

var uploadProfileImagesThumb = function(object) {
   // var uploadFiles= new Promise(function(resolve, reject){


        var thumbImagesPath = profileImagesLocalPath+'thumb/';
       // fs.readdirSync(thumbImagesPath).forEach(file => {
            //console.log('profileIamge thumb detected :'+file);
        var fileToUpload = object.file;
    var destInStorage =  thumbImagesPath+fileToUpload;
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
                updateFirebaseDB(object);
                //resolve(object);
            });

            }
        });
    //});
   // })
    //return uploadFiles;

}






function updateFirebaseDB(object){
    var appConfigurationRef = firebase.database().ref('app_configuration');
    var profileImageFirebaseRef = appConfigurationRef.child('profile_images');
    var firebaseUpdate = profileImageFirebaseRef.push();
    var update = {
        'file' : object.file,
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
        }
    });

}


buildServiceAccountPath()
    .then(loadServiceAccountPath)
    .then(uploadProfileImagesFull);
   // .then(uploadProfileImagesThumb);

    //.then(uploadProfileImagesThumb);
return;

/*

let myFirstPromise = new Promise((resolve, reject) => {
        // We call resolve(...) when what we were doing made async successful, and reject(...) when it failed.
        // In this example, we use setTimeout(...) to simulate async code.
        // In reality, you will probably be using something like XHR or an HTML5 API.
        fs.readFileSync(expandHomeDir('~/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json'));
        fs.readFile(expandHomeDir('~/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json'), 'utf8', function (err, data) {
        if (err) {
            reject(console.log(err));
        }
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(JSON.parse(data)),
                databaseURL: 'https://friendlypix-d292b.firebaseio.com'
            });
        }
        console.log(firebase);

        resolve(serviceAccount=data);
    });

})
;

let mySecondPromise = new Promise((resolve, reject) => {


        setTimeout(function(){
            resolve("Success!"); // Yay! Everything went well!
        }, 250
)
;
})
;
/!*
let loadFirebasePromise = new Promise((resolve, reject) => {
        if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(JSON.parse(serviceAccount)),
        databaseURL: 'https://friendlypix-d292b.firebaseio.com'
    });
};
})
;*!/

myFirstPromise.then((successMessage) => {
    // successMessage is whatever we passed in the resolve(...) function above.
    // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
    console.log("Yay! " + successMessage);


}).then(mySecondPromise);//.then(initFirebase());


function initFirebase() {
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: 'https://<PROJECT_ID>.firebaseio.com'
    });
}


return;
function timeout(delay) {
    return new Promise(function (resolve, reject) {
        fs.readFile(expandHomeDir('~/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json'), 'utf8', foo);
        //setTimeout(foo, delay);
    });
}
var foo = function foo() {
    console.log("foo")
}

timeout(2);
return;

var readCred = fs.readFile(expandHomeDir('~/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json'), 'utf8');
/!*var readCred = fs.readFile(expandHomeDir('~/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json'), 'utf8', function (err, data) {
 if (err) {
 return console.log(err);
 }
 console.log(data);
 return data;
 });*!/

Promise.resolve(readCred).then(function (value) {
    console.log(value); // "Success"
}, function (value) {
    console.log(value);
    // not called
});
var value = 10;
return;
var promiseForValue = Promise.resolve(value);
// equivalent to
var promiseForValue = new Promise(function (fulfill) {
    console.log(value);
    return;

});

var realPromise = Promise.resolve(readCred);
return;


Promise.all(fs);
var dataA = " ";

return;
Promise.all([dataA]).then(function (resp) {
    console.log("foo")
}).catch(function (error) {
    console.log('error', error);
});
exit;

function getPromiseResolveFn() {
    var res;
    new Promise(function (resolve) {
        fs.readFile(expandHomeDir('~/dev/friendlypix-d292b-firebase-adminsdk-1bflr-6b9fac5cd7.json'), 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log(data);
            dataA = data;
        });
        res = resolve;
    });
    // res is guaranteed to be set
    return res;
}

// [START initialize]
// Initialize the app with a service account, granting admin privileges
var serviceAccount = require('./../firebase.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://<PROJECT_ID>.firebaseio.com'
});
// [END initialize]
// Create a root reference
var storageRef = firebase.storage().ref();

Promise.all([topPostsRef.once('value'), allUserRef.once('value')]).then(function (resp) {
    var topPosts = resp[0].val();
    var allUsers = resp[1].val();
    var emailText = createWeeklyTopPostsEmailHtml(topPosts);
    sendWeeklyTopPostEmail(allUsers, emailText);
}).catch(function (error) {
    console.log('Failed to start weekly top posts emailer:', error);
});

/!**
 * Send the new star notification email to the given email.
 *!/
function sendNotificationEmail(email) {
    var mailOptions = {
        from: '"Firebase Database Quickstart" <noreply@firebase.com>',
        to: email,
        subject: 'New star!',
        text: 'One of your posts has received a new star!'
    };
    return mailTransport.sendMail(mailOptions).then(function () {
        console.log('New star email notification sent to: ' + email);
    });
}

/!**
 * Update the star count.
 *!/
// [START post_stars_transaction]
function updateStarCount(postRef) {
    postRef.transaction(function (post) {
        if (post) {
            post.starCount = post.stars ? Object.keys(post.stars).length : 0;
        }
        return post;
    });
}
// [END post_stars_transaction]

/!**
 * Keep the likes count updated and send email notifications for new likes.
 *!/
function startListeners() {
    firebase.database().ref('/posts').on('child_added', function (postSnapshot) {
        var postReference = postSnapshot.ref;
        var uid = postSnapshot.val().uid;
        var postId = postSnapshot.key;
        // Update the star count.
        // [START post_value_event_listener]
        postReference.child('stars').on('value', function (dataSnapshot) {
            updateStarCount(postReference);
            // [START_EXCLUDE]
            updateStarCount(firebase.database().ref('user-posts/' + uid + '/' + postId));
            // [END_EXCLUDE]
        }, function (error) {
            console.log('Failed to add "value" listener at /posts/' + postId + '/stars node:', error);
        });
        // [END post_value_event_listener]
        // Send email to author when a new star is received.
        // [START child_event_listener_recycler]
        postReference.child('stars').on('child_added', function (dataSnapshot) {
            //sendNotificationToUser(uid, postId);
        }, function (error) {
            console.log('Failed to add "child_added" listener at /posts/' + postId + '/stars node:', error);
        });
        // [END child_event_listener_recycler]
    });
    console.log('New star notifier started...');
    console.log('Likes count updater started...');
}


// Start the server.
startListeners();
*/
