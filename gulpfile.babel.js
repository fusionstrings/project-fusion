import gulp from 'gulp';
import browserSync from 'browser-sync';
import {merge, map} from 'event-stream';
import bump from 'gulp-bump';
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

gulp.task('bump', () => {
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('changelog', () => {
  const newChangesStream = changelog(
    {preset: 'angular'}
  );

  const oldChangesStream = gulp.src('CHANGELOG.md')
    .pipe(map((file, cb) => cb(null, file.contents)));

  const latestChangesFileStream = newChangesStream
    .pipe(source('LATEST_CHANGES.md'));

  const changelogFileStream = series(newChangesStream, oldChangesStream)
    .pipe(source('CHANGELOG.md'));

  return merge(changelogFileStream, latestChangesFileStream)
    .pipe(gulp.dest('.'));
  /*
  conventionalChangelog({
    preset: 'angular'
  })
  .pipe(source('./'))
  .pipe(buffer())
  .pipe(addsrc.append('CHANGELOG.md'))
  .pipe(concat('CHANGELOG.md'))
  .pipe(gulp.dest('./'));
  */
});