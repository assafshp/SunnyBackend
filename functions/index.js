
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
/*exports.makeUppercase = functions.database.ref('/posts/{pushId}/text')
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
 ;*/



const gcs = require('@google-cloud/storage')();
//const CLOUD_BUCKET = 'friendlypix-d292b.appspot.com';

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
        //  var postMeta = event.data.val();// toString();
        var toDelete = event.data.val();// toString();
var postMetaId = event.params.postMetaId;

console.log("state event detected : new deleted state = " + toDelete);
if (toDelete != true) {
    return "should not be deleted";
}
var baseRef =event.data.adminRef.root;
var users_posts_map_ref = baseRef.child("mapping").child("users_posts_map");
var country_code_map_ref = baseRef.child("mapping").child("country_code_posts_map");
var all_posts_map_ref = baseRef.child("mapping").child("all_posts_map");


var postMetaRef = event.data.ref.parent;
//console.log(postMetaRef);
return postMetaRef.once('value')
        .then(postMeta => {
        postMetaObject =postMeta.val();
console.log("postMetaObject : "+ JSON.stringify(postMetaObject));
var filePathToDelete = postMetaObject.base_storage_uri_path;
all_posts_map_ref.child(postMetaId).remove();
users_posts_map_ref.child(postMetaObject.userId).child(postMetaId).remove();
country_code_map_ref.child(postMetaObject.country_code).child(postMetaId).remove();

console.log("base_storage_uri_path: " + filePathToDelete);
//setting up bucket with path to delete
const bucket = gcs.bucket(functions.config().firebase.storageBucket);
bucket.deleteFiles({
    prefix: filePathToDelete + "/",
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

exports.deleteMessages = functions.database.ref("chats/messages-meta/{messageMetaId}/delete").onUpdate((event) => {
        //  var postMeta = event.data.val();// toString();
        var toDelete = event.data.val();// toString();
var messageMetaId = event.params.messageMetaId;

console.log("state event detected : new deleted state = " + toDelete);
if (toDelete != true) {
    return "should not be deleted";
}
//var users_posts_map_ref = event.data.adminRef.root.child("users_posts_map");
//var country_code_map_ref = event.data.adminRef.root.child("country_code_posts_map");


var messageMetaRef = event.data.ref.parent;
//console.log(postMetaRef);
return messageMetaRef .once('value')
        .then(messageMeta => {
        messageMetaObject =messageMeta.val();

var messageKeysPerChat = event.data.adminRef.root.child("chats/meta_keys_per_chat").child(messageMetaObject.chatId);


console.log("messageMetaObject : "+ JSON.stringify(messageMetaObject));
messageKeysPerChat.child(messageMetaId).remove();
if(messageMetaObject.messageType!='post'){
    console.log("messageType is "+messageMetaObject.messageType +"exit from function")
    return false;
}

var filePathToDelete = messageMetaObject.firePostMeta.base_storage_uri_path;


console.log("base_storage_uri_path: " + filePathToDelete);
//setting up bucket with path to delete
const bucket = gcs.bucket(functions.config().firebase.storageBucket);
bucket.deleteFiles({
    prefix: filePathToDelete + "/",
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
console.log("postMetaObject : "+ JSON.stringify(postMetaObject));
var countryCode = postMetaObject.country_code;
var postTimestamp = postMetaObject.timestamp ;
console.log(countryCode);

var postMetaId = event.params.postMetaId;
//console.log(postMetaId);
//var users_posts_map_ref = event.data.ref.parent.parent.child("users_posts_map");
var users_posts_map_ref = event.data.adminRef.root.child("mapping").child("users_posts_map");
var country_code_map_ref = event.data.adminRef.root.child("mapping").child("country_code_posts_map");
var all_posts_map_ref = event.data.adminRef.root.child("mapping").child("all_posts_map");
//console.log(userId, postMetaId + ' ' + users_posts_map_ref);
if(userId==null){
    throw new Error('userId is not defiend ');
}

all_posts_map_ref.child(postMetaId).child("timestamp").set(postTimestamp );
users_posts_map_ref.child(userId).child(postMetaId).child("timestamp").set(postTimestamp );
if(countryCode!=null){
    country_code_map_ref.child(countryCode).child(postMetaId).child("timestamp").set(postTimestamp );
}
console.log("post creator userId = " + userId);

return true;


});


/*

exports.messagesKeysPerChatMap = functions.database.ref("chats/messages-meta/{messageMetaId}").onCreate((event) => {
        var eventData = event.data
        var messageMetaObject = eventData.val();
var chatId = messageMetaObject.chatId;
console.log("messageMetaObject : "+ JSON.stringify(messageMetaObject));
//var countryCode = postMetaObject.country_code;

var messageMetaId = event.params.messageMetaId;
var meta_keys_per_chat = event.data.adminRef.root.child("chats").child("meta_keys_per_chat");

meta_keys_per_chat.child(chatId).child(messageMetaId).set(true, function(error) {
    if (error) {
        console.log("Data could not be saved." + error);
    } else {
        console.log("Data saved successfully.");
    }
});

console.log("message with id = " + messageMetaId + " added into messages key of chat id :" +chatId);

return true;


});
*/
