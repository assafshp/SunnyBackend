# Spring Boot Web Application

Sunny app backend


functions deploy:
cd functions
firebase deploy --only functions




#upload-files-to-firebase-storage-using-node-js
https://stackoverflow.com/questions/39848132/upload-files-to-firebase-storage-using-node-js
https://stackoverflow.com/questions/40808590/uploading-file-to-google-cloud-storage-locally-using-nodejs
https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase
https://stackoverflow.com/questions/38597802/delete-folder-in-google-cloud-storage-using-nodejs-gcloud-api


options to uploads to gcp https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/0.8.0/storage/bucket?method=upload
https://cloud.google.com/storage/docs/object-basics
firebase function al smaples https://github.com/firebase/functions-samples
firebase deploy --only functions:addMessage

deploy backend :
https://firebase.google.com/docs/cli/

add alias :
firebase use --add

firebase use <alias_or_project_id>

deploy all:
firebase deploy


rest deploy data :
curl -X PUT -d @sunny_ask_data   'https://friendlypix-d292b.firebaseio.com/rest/sunny_ask_data.json'
