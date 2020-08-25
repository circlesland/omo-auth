#!/bin/sh
cd data || exit
rm -r dist
rm -r node_modules
rm -f pacakge-lock.json
npm i
npm run generate
npx tsc

cd ../mailer || exit
rm -r dist
rm -r node_modules
rm -f pacakge-lock.json
npm i
npx tsc

cd ../server || exit
rm -r dist
rm -r node_modules
rm -f pacakge-lock.json
npm i
npm run generate
npx tsc
