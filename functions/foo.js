/*
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
//exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
/!*exports.makeUppercase = functions.database.ref('/posts/{pushId}/text')
        .onWrite(event => {
        // Grab the current value of what was written to the Realtime Database.
        const text = event.data.val();
console.log('Uppercasing', event.params.pushId, text);
const uppercase = text.toUpperCase();
// You must return a Promise when performing asynchronous tasks inside a Functions such as
// writing to the Firebase Realtime Database.
// Setting an "uppercase" sibling in the Realtime Database returns a Promise.
return 'foo';
//event.data.ref.parent.child('uppercase').set(uppercase);
})
;*!/



const gcs = require('@google-cloud/storage')();
const CLOUD_BUCKET = 'friendlypix-d292b.appspot.com';

exports.followersCount = functions.database.ref("followers/{userId}/followers/{followersId}").onWrite((event) => {
    var collectionRef = event.data.ref.parent;
    var countRef = collectionRef.parent.child('followers_count');

    return countRef.transaction(function (current) {
        if (event.data.exists() && !event.data.previous.exists()) {
            return (current || 0) + 1;
        }
        else if (!event.data.exists() && event.data.previous.exists()) {
            return (current || 0) - 1;
        }
    });
});

exports.followingsCount = functions.database.ref("followers/{userId}/following/{followingId}").onWrite((event) => {
    var collectionRef = event.data.ref.parent;
    var countRef = collectionRef.parent.child('following_count');

    return countRef.transaction(function (current) {
        if (event.data.exists() && !event.data.previous.exists()) {
            return (current || 0) + 1;
        }
        else if (!event.data.exists() && event.data.previous.exists()) {
            return (current || 0) - 1;
        }
    });
});

/!**
 * requirement: when user block other user - the chat id if e//todo
 * @type {boolean}
 *!/
/!*

exports.blockchats = functions.database.ref("blocks_by_user/{userId}/{blockedUserId}").onWrite((event) => {
        //var collectionRef = event.data.ref.parent;
        const original = event.params.blockedUserId;
console.log('Uppercasing', event.params.blockedUserId,event.params.userId, original);

var userId = event.params.userId;
var blockedUserId = event.params.blockedUserId;
var blockedUserRef = admin.database().ref('chats/block_to_chats');
const blockedChatId = event.data.ref.root.child('chats/members').child(userId).child('members_to_chats').child(blockedUserId).val();
console.log('blockedChatId: '+blockedChatId);
return blockedUserRef.set({ first: 'Ada', last: 'Lovelace' })
    .then(function() {
        console.log('Synchronization succeeded');
    })
    .catch(function(error) {
        console.log('Synchronization failed');
    });

/!*return blockedUserRef.transaction(function (current) {
    if (event.data.exists() && !event.data.previous.exists()) {
        return 'true';
    }
    else if (!event.data.exists() && event.data.previous.exists()) {
        return 'false';
    }
});*!/
});
*!/



exports.blockchatsTemp = functions.database.ref("chats/conversations/{chatId}/limitations/blockedBy/{userId}").onWrite((event) => {
    //var collectionRef = event.data.ref.parent;
    var chatId = event.params.chatId;
    var blockedRef = event.data.ref.parent;
    return blockedRef.once('value')
        .then(blockData => {
            var toBlock = false;
            blockData.forEach(function (snapshot1) {
                console.log(snapshot1.key + ' value :' + snapshot1.val());
                if (snapshot1.key != null && snapshot1.val() == true) {
                    toBlock = true;

                }
            });
            var blockOnChatLevel = blockedRef.parent.parent.child('blocked').set(toBlock)

            console.log('num of children : ' + blockData.numChildren() + 'value :' + blockData.val() + ' to block ?' + toBlock)
        }
        );
});
//todo change to onCreate()
exports.deletePost = functions.database.ref("posts_meta/{postMetaId}/delete").onUpdate((event) => {
    var postMeta = event.data.val();// toString();
    var toDelete = postMeta.delete;// toString();
    var postMetaId = event.params.postMetaId;
    var countryCode = postMetaObject.countryCode;
    console.log("state event detected : new deleted state = " + toDelete);
    if (toDelete != true) {
        return true;
    }
    var users_posts_map_ref = event.data.adminRef.root.child("users_posts_map");
    var country_code_map_ref = event.data.adminRef.root.child("country_code_posts_map");

    users_posts_map_ref.child(postMeta.userId).child(postMetaId).remove();
    country_code_map_ref.child(countryCode).child(postMetaId).set(true);
    var postMetaRef = event.data.ref.child("base_storage_uri_path");
    return postMetaRef.once('value')
        .then(base_storage_uri_path => {
            var filePath = base_storage_uri_path.val();
            console.log("base_storage_uri_path: " + filePath);
            const bucket = gcs.bucket(functions.config().firebase.storageBucket);
            bucket.deleteFiles({
                prefix: filePath + "/",
                force: true
            }, function (errors) {
                if (errors != null) {
                    console.log("errors :" + errors);
                }
                // `errors`:
                //    Array of errors if any occurred, otherwise null.
            });

        });
});
exports.usersPostsMap = functions.database.ref("posts_meta/{postMetaId}").onCreate((event) => {
    var eventData = event.data
    var postMetaObject = eventData.val();
    var userId = postMetaObject.userId;
    var countryCode = postMetaObject.countryCode;
    var postMetaId = event.params.postMetaId;
    //var users_posts_map_ref = event.data.ref.parent.parent.child("users_posts_map");
    var users_posts_map_ref = event.data.adminRef.root.child("users_posts_map");
    var country_code_map_ref = event.data.adminRef.root.child("country_code_posts_map");
    //console.log(userId, postMetaId + ' ' + users_posts_map_ref);
    if(userId=null){
        throw new Error('userId is not defiend ');
    }
    users_posts_map_ref.child(userId).child(postMetaId).set(true);
    if(countryCode!=null){
    country_code_map_ref.child(countryCode).child(postMetaId).set(true);
    }
    return;
    console.log("post creator userId = " + userId);
    /!* if(toDelete==null) {
         return true;
     }
     var postMetaRef = event.data.ref.parent.child("base_storage_uri_path");
     return postMetaRef.once('value')
             .then(base_storage_uri_path => {
             var filePath = base_storage_uri_path.val();
     console.log("base_storage_uri_path: "+filePath);
     const bucket = gcs.bucket(functions.config().firebase.storageBucket);
     bucket.deleteFiles({
         prefix:filePath+"/" ,
         force: true
     }, function(errors) {
         if (errors != null) {
             console.log("errors :" + errors);
         }
         // `errors`:
         //    Array of errors if any occurred, otherwise null.
     });*!/

});
    // console.log("file path to delete : " + event.data.ref.parent.child("base_storage_uri_path").val());



    //      var collectionRef = event.data.ref.parent;
//var countRef = collectionRef.parent.child('following_count');

/!*return countRef.transaction(function (current) {
    if (event.data.exists() && !event.data.previous.exists()) {
        return (current || 0) + 1;
    }
    else if (!event.data.exists() && event.data.previous.exists()) {
        return (current || 0) - 1;
    }
});*!/


//copy line shift+alt+down arrow
//copy line*/
