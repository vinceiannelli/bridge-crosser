#!/bin/zsh

cd src

FILE='./server-running.txt'

if [ -f "$FILE" ];
then 
cd front-end
node index.js
else
touch './server-running.txt'
cd back-end
node server.js &
wait
cd ../front-end
node index.js
fi


    