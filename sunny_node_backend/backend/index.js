
'use strict';

var firebase = require('firebase-admin');

var Promise = require('promise');

var cron = require('node-cron');

var fs = require('fs')
var homePath = expandHomeDir('~/dev/private_keys/' + env + '/pk.json');

const Storage = require('@google-cloud/storage');
var gcs;
var bucket;

//tmp values
var app_id = 'friendlypix-d292b';
var CLOUD_BUCKET = app_id; //config.get('CLOUD_BUCKET');
var env = 'stg';

//Constants
const bucket_suffix ='.appspot.com';

//import upload_resources functionality
var upload_resources_service = require('../../resources_bootstrap/index');

//get external arguments for run configurations
if (process.argv[2] != null) {
    env = process.argv[2];
}

if (process.argv[3] != null) {
    app_id = process.argv[3];
    CLOUD_BUCKET = app_id + bucket_suffix;
}

/**
 * load service account content to pass for further authentication
 * @returns {*|Promise}
 */
var buildServiceAccountPath = function() {
    var promise = new Promise(function(resolve, reject) {
        fs.readFile(homePath, 'utf8', function(err, data) {
            if (err) {
                reject(console.log(err));
            }

            console.log("loaded cred json from file system")
            resolve({
                data: data
            });
        });
    });
    return promise;
};

/**
 * authenticate firebase client which will pass to consumer all over the service
 * @param firebaseCredResults
 * @returns {*|Promise}
 */
var loadServiceAccountFromPath = function(firebaseCredResults) {
    var promise = new Promise(function(resolve, reject) {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(JSON.parse(firebaseCredResults.data)),
                databaseURL: 'https://' + app_id + '.firebaseio.com'
            });
        }

        gcs = Storage({
            projectId: app_id,
            keyFilename: homePath
        });
        bucket = gcs.bucket(CLOUD_BUCKET);

        //is fire loaded? if not stop the process
        if (firebase.apps.length) {
            console.log("firebase loaded");
            resolve()
        } else {
            console.log("failed to load firebase");
            reject(process.exit())
        }

    });
    return promise;
};


const HOUR_IN_MILLI_SECONDS = 60 * 60 * 1000 * 1 // seconds*minutes*milli*hours
/**
 *  Schedulers for mark last day posts as "should be deleted"
 * @returns {*|Promise}
 */
var scheduleDeletionPosts = function() {
    var promise = new Promise(function(resolve, reject) {
        var db = firebase.database();
        var ref = db.ref("/posts_meta/").orderByChild("delete").equalTo(false);

        cron.schedule('0 * * * *', function() {
            console.log('running a schedule every hour');

            ref.on("child_added", function(snapshot, prevChildKey) {
                var postMeta = snapshot.val();

                console.log("postMeta.timestamp: " + postMeta.timestamp + "real date : " + new Date(postMeta.timestamp));
                console.log("postMeta.ttl: " + postMeta.ttl);

                if (postMeta.timestamp + postMeta.ttl * HOUR_IN_MILLI_SECONDS < Date.now()) {
                    console.log("postId: " + snapshot.key + " should be deleted");
                    snapshot.ref.child("delete").set(true);
                } else {
                    console.log("postId: " + snapshot.key + " should  not be deleted");

                }
            });
            resolve()
        });
    });
    return promise;
};
/**
 *  Schedulers for mark last day chat messages as "should be deleted"
 * @returns {*|Promise}
 */
var scheduleDeletionMessages = function() {
    var promise = new Promise(function(resolve, reject) {
        var db = firebase.database();
        var ref = db.ref("/chats/messages-meta/").orderByChild("delete").equalTo(false);

        cron.schedule('0 * * * *', function() {
            console.log('running a schedule every hour');

            ref.on("child_added", function(snapshot, prevChildKey) {
                var messageMeta = snapshot.val();


                console.log("messageMeta.timestamp: " + messageMeta.timestamp + "real date : " + new Date(messageMeta.timestamp));
                console.log("messageMeta.ttl: " + messageMeta.ttl);

                if (messageMeta.timestamp + messageMeta.ttl * HOUR_IN_MILLI_SECONDS < Date.now()) {
                    console.log("messageId: " + snapshot.key + " should be deleted");
                    snapshot.ref.child("delete").set(true);
                } else {
                    console.log("messagetId: " + snapshot.key + " should  not be deleted");

                }
            });
        });
    });
    return promise;
};

var triggerUpload = function() {
    upload_resources_service.uploadResources(firebase, bucket)
}
//in app provisioning set the 4th argument to true (upload images)
var loadResources = false;
if (process.argv[4] != null) {
    loadResources = (process.argv[4] === 'true');
}
if (loadResources) {
    buildServiceAccountPath()
        .then(loadServiceAccountFromPath)
        .then(triggerUpload);
}

buildServiceAccountPath()
    .then(loadServiceAccountFromPath)
    .then(scheduleDeletionPosts);

buildServiceAccountPath()
    .then(loadServiceAccountFromPath)
    .then(scheduleDeletionMessages);

return;