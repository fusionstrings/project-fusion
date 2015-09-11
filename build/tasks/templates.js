import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';
const $ = gulpLoadPlugins();

/*
gulp.task('nunjucks', () => {
    $.nunjucksRender.nunjucks.configure([paths.root], { watch: false });
    return gulp.src(paths.templatesNunjucks)
        .pipe($.nunjucksRender())
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('nunjucks:dist', () => {
    $.nunjucksRender.nunjucks.configure([paths.root], { watch: false });
    return gulp.src(paths.templatesNunjucks)
        .pipe($.nunjucksRender())
        .pipe(gulp.dest(paths.output));
});
*/

// Scan your HTML for assets & optimize them
gulp.task('templates', () => {
  const assets = $.useref.assets({ searchPath: `{ ${paths.root}, ${paths.tmp }` });
  $.nunjucksRender.nunjucks.configure([paths.root], { watch: false }); //gulp-nunjucks-render
  return gulp.src(paths.templates)
    .pipe($.if('*.nunjucks', $.nunjucksRender()))
    .pipe(gulp.dest(paths.tmp))

    .pipe(assets)

    // Remove any unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({
      html: [
        paths.templatesMain
      ]//,
      // CSS Selectors for UnCSS to ignore
      //ignore: []
    })))

    // Concatenate and minify styles
    // In case you are still using useref build blocks
    .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())

    // Minify any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest(paths.output))
    .pipe($.size({title: 'html'}));
});
