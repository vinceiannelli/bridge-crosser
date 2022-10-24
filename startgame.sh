#!/usr/bin/zsh

cd src

FILE='./server-running.txt'

if [ -f "$FILE" ];
then 
node index.js
else
node server.js & touch './server-running.txt'
node index.js
fi


