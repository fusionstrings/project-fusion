import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

//Lint JavaScript
gulp.task('eslint', () => {
  return gulp.src(paths.scripts)
    .pipe(reload({ stream: true, once: true }))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()))
    .pipe($.jscs());
});
