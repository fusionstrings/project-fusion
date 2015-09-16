import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';

const $ = gulpLoadPlugins();

//Generate JavaScript docs
gulp.task('esdoc', () => {
  gulp.src(paths.root)
    .pipe($.esdoc({ destination: paths.tmpEsdoc }));
});

//Generate JavaScript docs for deployment
gulp.task('esdoc:dist', () => {
  gulp.src(paths.root)
    .pipe($.esdoc({ destination: paths.outputEsdoc }));
});