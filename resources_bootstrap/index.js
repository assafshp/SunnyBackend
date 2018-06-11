
'use strict';

// [START imports]
var firebase = require('firebase-admin');
// [END imports]
var Promise = require('promise');



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