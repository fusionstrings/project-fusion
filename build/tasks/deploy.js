import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';

const $ = gulpLoadPlugins();

gulp.task('deploy', () => {
  return gulp.src(paths.build)
    .pipe($.ghPages());
});
