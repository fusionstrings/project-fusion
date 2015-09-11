import gulp from 'gulp';
import browserSync from 'browser-sync';
import paths from '../paths';

const reload = browserSync.reload;

// Watch files for changes & reload
gulp.task('serve', ['styles', 'styleguide', 'templates'], () => {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'PF',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    //server: ['.tmp', 'app']
    server: {
      baseDir: [paths.tmp, paths.root],
      routes: paths.serveAltPaths
    }
  });

  gulp.watch([paths.templates], ['templates', reload]);
  //gulp.watch([paths.templatesNunjucks], ['nunjucks', reload]);
  //gulp.watch(['./app/**/*.md'], ['styleguide', reload]);
  gulp.watch(paths.styles, ['styles', 'styleguide', reload]);
  gulp.watch([paths.scripts], ['eslint', 'test']);
  gulp.watch(paths.images, reload);
  console.log(
        '\nDeveloper mode!\n\nSC5 Styleguide available at http://localhost:3000/\n'
    );
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () => {
  browserSync({
    notify: false,
    logPrefix: 'PF',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: paths.output,
    baseDir: paths.output
  });
});
