import gulp from 'gulp';
import styleguide from 'sc5-styleguide';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';
const $ = gulpLoadPlugins();


// Running styleguide development server to view the styles while you are working on them
//
// This task runs the interactive style guide for use by developers. It runs a built-in server
// and contains all the interactive features and should be updated automatically whenever the
// styles are modified.

gulp.task('styleguide:generate', function() {
  return gulp.src(paths.styles)
    .pipe(styleguide.generate({
        title: 'My First Development Styleguide',
        server: true,
        rootPath: paths.tmpStyleguide,
        overviewPath: paths.styleguideOverview
      }))
    .pipe(gulp.dest(paths.tmpStyleguide));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src(paths.cssMain)
    .pipe($.sass({
      errLogToConsole: true,
      precision: 10
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(paths.tmpStyleguide));
});

gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

// Building styleguide for static hosting to be displayed as a part of the application
//
// Here we build the styleguide so it can be included in a web folder within the app.
// The benefit for including the styleguide at /styleguide path of the app is that
// everyone can always find a master copy of the style guide. Another benefit is that
// this copy will be load balanced by the web server, so it can handle heavy loads.
// All interactive features are disabled to prevent users from tampering with the
// styles.

gulp.task('styleguide:dist:generate', function() {
  return gulp.src(paths.styles)
    .pipe(styleguide.generate({
        title: 'My First Hosted Styleguide Build',
        rootPath: paths.outputStyleguide,
        appRoot: paths.outputStyleguidePath,
        overviewPath: paths.styleguideOverview
      }))
    .pipe(gulp.dest(paths.outputStyleguide));
});

gulp.task('styleguide:dist:applystyles', function() {
  return gulp.src(paths.cssMain)
    .pipe($.sass.sync({
      errLogToConsole: true,
      precision: 10,
      includePaths: ['.']
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(paths.outputStyleguide));
});

gulp.task('styleguide:dist', ['styleguide:dist:generate', 'styleguide:dist:applystyles']);
