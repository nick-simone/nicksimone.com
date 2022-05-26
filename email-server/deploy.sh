#!/bin/bash

npm run build
scp -r dist ubuntu@ec2-34-234-154-26.compute-1.amazonaws.com:/home/ubuntu/
scp package.json ubuntu@ec2-34-234-154-26.compute-1.amazonaws.com:/home/ubuntu/
ssh ubuntu@ec2-34-234-154-26.compute-1.amazonaws.com "npm i"
