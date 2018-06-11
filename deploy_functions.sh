#!/usr/bin/env bash

firebase deploy --only functions:followersCount
firebase deploy --only functions:followingsCount
firebase deploy --only functions:deleteMessages
firebase deploy --only functions:deletePost
firebase deploy --only functions:blockchatsTemp
firebase deploy --only functions:usersPostsMap

#exit 0;