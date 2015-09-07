[![wercker status](https://app.wercker.com/status/dd129b2edaa49f0b49698d108f209a83/m "wercker status")](https://app.wercker.com/project/bykey/dd129b2edaa49f0b49698d108f209a83)

[ ![Codeship Status for fusionstrings/project-fusion](https://codeship.com/projects/5d2be810-351d-0133-6d1a-16e7f2139dbb/status?branch=master)](https://codeship.com/projects/100679)

#Project Fusion

## Hello!

Presenting ambitious, opinionated and yet highly flexible web app starter kit for modular development.

### Features —

*   JSPM package manager
*   Support to ES6/Ecmascript 2015, AMD or common JS using System JS
*   Automatic semver bump based GIT commit message
*   Automatic release notes from GIT commit message
*   TDD / BDD using Karma, Mocha and Chai
*   Automatic styleguide generation
*   Styleguide variables can be changed from dashboard
*   External and internal dependency management from NPM, Bower, Github, Bitbucket, Stash or any custom private/public endpoint.
*   CSS as module dependency
*   Linting
*   Code coverage
*   CSS regression testing
*   Optimize HTML and CSS using CSS nano and HTML inspector

## How to use

### Installation

* Install Node JS
* You need to have Gulp and JSPM installed globally:

```sh
$ npm i -g gulp jspm
```
* Optionally bower if you intend to use it:

```sh
$ npm i -g bower
```
##### Also install Karma if you want to use Karma commands directly

```sh
$ npm i -g karma
```
##### Installing babel globally is a good idea

```sh
$ npm i -g babel
```

#### Install dependencies

```sh
$ npm install && jspm install
```

#### Start development server

```sh
$ gulp serve
```

It'll open browsersync development server at http://localhost:3001/ and Styleguide development server dashboard can be accessed at http://localhost:3000/. BrowserSync UI can be accessed at http://localhost:3002/

#### Serve files from distribution folder

```sh
$ gulp serve:dist
```

#### CSS regression testing
It uses [BackstopJS](https://github.com/garris/BackstopJS) for regression testing. To bypass running commands from `node_modules/backstopjs` folder I've aded following wrappers.

```sh
$ gulp gen-css-config # To generate Backstop config alternative to genConfig
$ gulp reference-css # To generate reference images alternative to reference
$ gulp test-css # To generate reference images alternative to test
```

#### Create build

```sh
$ gulp
```
It'll run tests, lint and create production build in `dist` folder. Static deployeble Styleguide build is located in `dist\styleguide`.

#### Git commit message format
Use following convention
https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md

#### Create release

```sh
$ gulp release
```
#### Create and install private end points


```sh
$ jspm registry config stash
```
Where stash is name of custom endpoint. It will prompt for repository server URL, credentials etc. as applicable. Once endpoint is configured, install it using:

```sh
$ jspm install stash:projname/reponame
```
Configure as many endpoints as required.

### Modules organization
It's recommended to install modules as external packages but application code in single application also  can be organized as modules. How modules are organized is totally depends on project but following is recommended way for it.

 * `app` directory holds main application code.
 * `app/styles`, `app/scripts`, `app/images`, `app/fonts` are used for generic application wide assets for CSS, JS, images and fonts. Which should mostly act as junction box and very minimal.
 * Modules will go in `app/fuses`.
 * Recommended way to name module root directory is to prefix it with `fuse-`, i.e. `fuse-my-module`.
 * A module shall be self sufficient and should not directly depend on other packages. It should be treated as separate repository even if it's part of main code base.
 * All releated assets e.g. CSS, tests, JS etc should go in module folder or `styles`, `scripts`, `images`, `tests`, `fonts` subfolders.
 * Test files should suffix `.spec`.

### Future roadmap (Work in progress)

*   Virtualise / containerise development environment using Vagrant and Docker
*   Completely automate issue management, development, deployment and CI
*   Single click deployment
*   Use SighJS as task runner

