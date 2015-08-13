import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';
const $ = gulpLoadPlugins();

// Copy web fonts to dist
gulp.task('fonts', () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.outputFonts))
    .pipe($.size({title: 'fonts'}));
});
