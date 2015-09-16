import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';

const $ = gulpLoadPlugins();

gulp.task('gen-css-config', $.shell.task([
    'gulp genConfig'
], {
   cwd: paths.backstop
}))

gulp.task('reference-css', $.shell.task([
    'gulp reference'
], {
   cwd: paths.backstop
}))

gulp.task('test-css', $.shell.task([
    'gulp test'
], {
   cwd: paths.backstop
}))
