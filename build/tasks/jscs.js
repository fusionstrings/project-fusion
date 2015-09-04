import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';

const $ = gulpLoadPlugins();

// Stylecheck javascripts
gulp.task('jscs', () => {
  return gulp.src(paths.scripts)
    .pipe($.jscs())
    .pipe($.size({title: 'jscs'}));
});
