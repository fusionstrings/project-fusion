import gulp from 'gulp';
import lost from 'lost';
import cssnano from 'cssnano';
import doiuse from 'doiuse';
import rucksack from 'rucksack-css';
import autoprefixer from 'autoprefixer';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';
const $ = gulpLoadPlugins();

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src(paths.styles)
    .pipe($.plumber())
    .pipe($.changed(paths.tmpStyle, {extension: '.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
        //lost grid https://github.com/corysimmons/lost
        lost(),
        //A little bag of CSS superpower http://simplaio.github.io/rucksack/
        rucksack(),
        //Autoprefixer https://github.com/postcss/autoprefixer
        autoprefixer({browsers: AUTOPREFIXER_BROWSERS}),
        doiuse({
          browsers: AUTOPREFIXER_BROWSERS,
          onFeatureUsage: function(usageInfo) {
            console.log(usageInfo.message);
          }
        }),
        //CSSnano http://cssnano.co/
        cssnano()
      ]))
    //.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(paths.tmp))
    // Concatenate and minify styles
    //.pipe($.if('*.css', $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.output))
    .pipe($.size({title: 'styles'}));
});
