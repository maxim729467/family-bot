#!/bin/bash

git pull && pm2 delete mafia && rm -rf dist && tsc && pm2 start ecosystem.config.js && pm2 save