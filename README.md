

## Sunny App backend tools

this section of the app is responsible for operations beside the managed DB

there are no api endpoint here so there is less importance of where this code run in terms
of scale and availability 

there are 4 modules:
##### firebase functions (serverless architecture ):
   perform most of the operations that firebase client (android sdk) do not perform
   things like block users,remove posts and messages,group post by lists of id's and 
   handle follwers and followings total numbers
##### Sunny node backend:
   contains schedulers for marking post or message with specific data.
   make the work that firebase functions can't do
##### Resources provisioning:
   This module could be run as standalone or part of the main node server
   the main propose is to upload or update resources in the server storage
#####  Storage and DB rules:
   small module with rules to protect the server from abuse,handle privacy ,
   block users ,and limit files uploaded to the storage 


in addition there are some small scripts to help with running some of those component
it is worth to mention that most of the work are done via firebase android sdk against 
Firebase server 
## technial details

Sunny app backend


functions deploy:
```
cd functions
firebase deploy --only functions
```
custom function deploy script
```
./deploy_functions.sh
```




deploy backend :
https://firebase.google.com/docs/cli/

add alias :
```
firebase use --add
firebase use <alias_or_project_id>
```
deploy all:
```
firebase deploy
```

rest deploy data :
```
curl -X PUT -d @sunny_ask_data   'https://friendlypix-d292b.firebaseio.com/rest/sunny_ask_data.json'
```

#####TODO or READ:

upload-files-to-firebase-storage-using-node-js
https://stackoverflow.com/questions/39848132/upload-files-to-firebase-storage-using-node-js
https://stackoverflow.com/questions/40808590/uploading-file-to-google-cloud-storage-locally-using-nodejs
https://stackoverflow.com/questions/42956250/get-download-url-from-file-uploaded-with-cloud-functions-for-firebase
https://stackoverflow.com/questions/38597802/delete-folder-in-google-cloud-storage-using-nodejs-gcloud-api



options to uploads to gcp https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/0.8.0/storage/bucket?method=upload
https://cloud.google.com/storage/docs/object-basics
firebase function al smaples https://github.com/firebase/functions-samples
firebase deploy --only functions:addMessage
