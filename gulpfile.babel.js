import gulp from 'gulp';
import browserSync from 'browser-sync';
import bump from 'gulp-bump';
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