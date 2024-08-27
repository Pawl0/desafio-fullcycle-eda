#!/bin/sh

npm run db:migrate
npm run db:seed
echo "DB initialized and migrations and seeds run!"
npm start