#!/bin/sh

# WIP - Prepares the server for Fluvicast stuff

echo "Making folders for user content..."
mkdir -p /var/u-fluvicast/
mkdir -p /var/u-fluvicast/users
mkdir -p /var/u-fluvicast/vod/

echo "Making the folders for the SSL files..."
mkdir -p /etc/fluvicast/
mkdir -p /etc/fluvicast/ssl/