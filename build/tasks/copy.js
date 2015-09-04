import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';
const $ = gulpLoadPlugins();

// Copy all files at the root level (app)
gulp.task('copy', () => {
  return gulp.src([
    `!${paths.root}*`,
    `!${paths.root}**/*.{html,nunjucks}`,
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest(paths.output))
    .pipe($.size({title: 'copy'}));
});
