#!/bin/bash
git config --global url."https://".insteadOf git://
git config core.longpaths true
#installChocolatey.cmd
#choco install visualstudio2015community
#choco install nodejs.install
npm install -g gulp karma jspm babel-core phantomjs casperjs
npm install
jspm registry create bitbucket jspm-git
#https://bitbucket.org/
jspm registry config bitbucket
jspm install
gulp serve
