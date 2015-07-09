import gulp from 'gulp';
import browserSync from 'browser-sync';
import fs from 'fs-extra';
//import {merge, map} from 'event-stream';
//import series from 'stream-series';
import bump from 'gulp-bump';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import changelog from 'conventional-changelog';
//import source from 'vinyl-source-stream';
//import buffer from 'vinyl-buffer';
//import addsrc from 'gulp-add-src';
//import concat from 'gulp-concat';
//import release from 'semantic-release-gitflow';
//import gitFlowBumpType from 'git-flow-bump-type';
import pkg from './package.json';

const reload = browserSync.reload;

// Watch files for changes & reload
gulp.task('serve', () => {
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
  //gulp.watch(['./styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/**/*.js'], reload);
  gulp.watch(['app/images/**/*'], reload);
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

gulp.task('cbump', () => {
  console.log('cbump');
  conventionalRecommendedBump({
    preset: 'angular'
  }, (err, releaseAs) => {
    console.log('releaseAs', releaseAs);
  });
});