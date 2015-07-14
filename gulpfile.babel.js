import gulp from 'gulp';
import browserSync from 'browser-sync';
import fs from 'fs-extra';
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
const outputPath = 'output';

// gulp.task('styleguide:generate', () => {
//   return gulp.src('app/**/*.scss')
//     .pipe(styleguide.generate({
//         title: 'My Styleguide',
//         server: true,
//         rootPath: outputPath,
//         appRoot: '/styleguide',
//         overviewPath: 'README.md'
//       }))
//     .pipe(gulp.dest(outputPath));
// });

// gulp.task('styleguide:applystyles', () => {
//   return gulp.src('app/hello/hello.scss')
//     .pipe($.sass({
//       errLogToConsole: true
//     }))
//     .pipe(styleguide.applyStyles())
//     .pipe(gulp.dest(outputPath));
// });


//gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

// Copy all files at the root level (app)
gulp.task('copy', () => {
  return gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

// Optimize images
gulp.task('images', function () {
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
        rootPath: 'dist/styleguide',
        overviewPath: 'app/styleguide/readme.md'
      }))
    .pipe(gulp.dest('dist/styleguide'));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src('app/styles/style.scss')
    .pipe($.sass({
      errLogToConsole: true
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest('dist/styleguide'));
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);
//Lint JavaScript
gulp.task('eslint', function () {
  return gulp.src('app/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['styleguide'], () => {
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
  gulp.watch(['./app/**/*.md'], ['styleguide', reload]);
  gulp.watch(['./app/**/*.{scss,css}'], ['styles', 'styleguide', reload]);
  gulp.watch(['app/**/*.js'], ['eslint']);
  gulp.watch(['app/images/**/*', 'app/**/images/**/*'], reload);
});


gulp.task('changelog', ['release'], () => {
  return changelog({
    repository: pkg.repository.url,
    preset: 'angular',
    //version: pkg.version,
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
// Load custom tasks from the `tasks` directory
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
