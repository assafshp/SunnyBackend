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