import gulp from 'gulp';
import browserSync from 'browser-sync';
import fs from 'fs-extra';
import {merge, map} from 'event-stream';
import series from 'stream-series';
//import bump from 'gulp-bump';
import bump from 'conventional-recommended-bump';
import changelog from 'conventional-changelog';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import addsrc from 'gulp-add-src';
import concat from 'gulp-concat';
import pkg from './package.json';

const reload = browserSync.reload;

// Watch files for changes & reload
gulp.task('serve', () => {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['./']
  });

  gulp.watch(['./**/*.html'], reload);
  //gulp.watch(['./styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['./scripts/**/*.js'], reload);
  gulp.watch(['./images/**/*'], reload);
});

gulp.task('changelog', () => {
  return changelog({
    repository: pkg.repository.url,
    version: pkg.version,
    file: './CHANGELOG.md'
  }, function(err, log) {
    fs.writeFileSync('CHANGELOG.md', log);
  });
});

/*
gulp.task('bump', () => {
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});
*/