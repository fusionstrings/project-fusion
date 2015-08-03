import gulp from 'gulp';
import browserSync from 'browser-sync';
import fs from 'fs-extra';
import path from 'path';
import swPrecache from 'sw-precache';
//import babelOptions from 'build/babel-options';
import del from 'del';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import styleguide from 'sc5-styleguide';
import bump from 'gulp-bump';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import changelog from 'conventional-changelog';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const babelOptions = {
    modules: 'system',
    moduleIds: false,
    comments: false,
    compact: false,
    stage:2,
    optional: [
      "es7.decorators",
      "es7.classProperties"
    ]
  };
const assign = Object.assign || require('object.assign');
// Create karma server
const karma = require('karma').server;
// Optimize images
gulp.task('images', () => {
  return gulp.src(['app/images/**', 'app/**/images/**'])
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Copy web fonts to dist
gulp.task('fonts', () => {
  return gulp.src(['app/**/fonts/**', 'app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Copy all files at the root level (app)
gulp.task('copy', () => {
  return gulp.src([
    'app/*',
    '!app/**/*.html',
    //'system.config.js',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/**/*.scss',
    'app/**/*.css'
  ])
    .pipe($.changed('.tmp/styles', {extension: '.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'styles'}));
});

// Running styleguide development server to view the styles while you are working on them
//
// This task runs the interactive style guide for use by developers. It runs a built-in server
// and contains all the interactive features and should be updated automatically whenever the
// styles are modified.

gulp.task('styleguide:generate', function() {
  return gulp.src(['app/**/*.scss'])
    .pipe(styleguide.generate({
        title: 'My First Development Styleguide',
        server: true,
        rootPath: '.tmp/styleguide',
        overviewPath: 'app/styleguide/readme.md'
      }))
    .pipe(gulp.dest('.tmp/styleguide'));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src('app/styles/style.scss')
    .pipe($.sass({
      errLogToConsole: true,
      precision: 10
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest('.tmp/styleguide'));
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

// Building styleguide for static hosting to be displayed as a part of the application
//
// Here we build the styleguide so it can be included in a web folder within the app.
// The benefit for including the styleguide at /styleguide path of the app is that
// everyone can always find a master copy of the style guide. Another benefit is that
// this copy will be load balanced by the web server, so it can handle heavy loads.
// All interactive features are disabled to prevent users from tampering with the
// styles.

gulp.task('staticStyleguide:generate', function() {
  return gulp.src(['app/**/*.scss'])
    .pipe(styleguide.generate({
        title: 'My First Hosted Styleguide Build',
        rootPath: 'dist/styleguide',
        //appRoot: '/',
        overviewPath: 'app/styleguide/readme.md'
      }))
    .pipe(gulp.dest('dist/styleguide'));
});

gulp.task('staticStyleguide:applystyles', function() {
  return gulp.src('app/styles/style.scss')
    .pipe($.sass({
      errLogToConsole: true,
      precision: 10
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest('dist/styleguide'));
});

gulp.task('staticStyleguide', ['staticStyleguide:generate', 'staticStyleguide:applystyles']);

//Lint JavaScript
gulp.task('eslint', function () {
  return gulp.src('app/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()));
});

// Bundle javascripts
gulp.task('scripts', () => {
  return gulp.src('')
    .pipe($.shell('jspm bundle-sfx app/scripts/main dist/scripts/main.min.js --minify --skip-source-maps'))
    .pipe($.size({title: 'scripts'}));
});

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  const assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/**/*.html')
    .pipe(assets)
    // Remove any unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        'app/index.html'
      ]//,
      // CSS Selectors for UnCSS to ignore
      //ignore: []
    })))

    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())

    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}, cb));

// Watch files for changes & reload
gulp.task('serve', ['styleguide', 'test'], () => {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'PF',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    //server: ['.tmp', 'app']
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
        '/jspm_packages': 'jspm_packages',
        '/system.config.js':'system.config.js'
      }
    }
  });

  gulp.watch(['app/**/*.html'], reload);
  //gulp.watch(['./app/**/*.md'], ['styleguide', reload]);
  gulp.watch(['./app/**/*.{scss,css}'], ['styles', 'styleguide', reload]);
  gulp.watch(['app/**/*.js'], ['eslint']);
  gulp.watch(['app/images/**/*', 'app/**/images/**/*'], reload);
  console.log(
        '\nDeveloper mode!\n\nSC5 Styleguide available at http://localhost:3000/\n'
    );
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () => {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    baseDir: 'dist'
  });
});

// Build production files, the default task
gulp.task('default', ['clean'], cb => {
  runSequence(
    'styles',
    ['eslint', 'html', 'scripts', 'images', 'fonts', 'copy'],
    'staticStyleguide',
    cb
  );
});

gulp.task('changelog', ['release'], () => {
  return changelog({
    repository: pkg.repository.url,
    preset: 'angular',
    //version: pkg.version,
    //append: true,
    file: './CHANGELOG.md'
  }, (err, log) => {
    fs.writeFileSync('CHANGELOG.md', log);
  });
});

gulp.task('bump', () => {
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('release', () => {
  //release();
  conventionalRecommendedBump({
    preset: 'angular'
  }, (err, releaseAs) => {
    console.log('releaseAs', releaseAs);
    gulp.src('./package.json')
    .pipe(bump({type: releaseAs}))
    .pipe(gulp.dest('./'));
  });
  console.log('released');
});

// Run PageSpeed Insights
gulp.task('pagespeed', cb => {
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});

// Testing
gulp.task('test', (done) => {
  karma.start({
    configFile: path.join(__dirname, '/karma.conf.js'),
    singleRun: false,
    autoWatch: true
  }, done);
});
// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
gulp.task('generate-service-worker', cb => {
  const rootDir = 'dist';

  swPrecache({
    cacheId: pkg.name || 'project-fusion',
    staticFileGlobs: [
      '${rootDir}/fonts/**/*.woff',
      '${rootDir}/images/**/*',
      '${rootDir}/scripts/**/*.js',
      '${rootDir}/styles/**/*.css',
      '${rootDir}/*.{html,json}'
    ],
    stripPrefix: path.join(rootDir, path.sep)
  }, (err, swFileContents) => {
    if (err) {
      cb(err);
      return;
    }

    const filepath = path.join(rootDir, 'service-worker.js');

    fs.writeFile(filepath, swFileContents, err => {
      if (err) {
        cb(err);
        return;
      }

      cb();
    });
  });
});

// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
