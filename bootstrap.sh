#!/bin/bash
git config --global url."https://".insteadOf git://
git config core.longpaths true
# installChocolatey.cmd
# choco install visualstudio2015community
# choco install nodejs.install
npm install -g gulp karma jspm babel-core phantomjs casperjs@1.1.0-beta3
npm install
#jspm registry create bitbucket jspm-git
## ssh://git@bitbucket.org
#jspm registry config bitbucket ssh://git@bitbucket.org
jspm config registries.bitbucket.baseurl ssh://git@bitbucket.org
jspm config registries.bitbucket.handler jspm-git
jspm install
gulp serve
