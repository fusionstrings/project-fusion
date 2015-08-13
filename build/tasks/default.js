import gulp from 'gulp';
import runSequence from 'run-sequence';

// Build production files, the default task
gulp.task('default', ['clean'], cb => {
  runSequence(
    'styles',
    ['eslint', 'templates', 'scripts', 'images', 'fonts', 'copy'],
    'styleguide:dist',
    cb
  );
});
