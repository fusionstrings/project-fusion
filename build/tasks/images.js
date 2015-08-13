import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';
const $ = gulpLoadPlugins();

// // Optimize images
// gulp.task('images', () => {
//   return gulp.src(paths.images)
//     // .pipe($.cache($.imagemin({
//     //   progressive: true,
//     //   interlaced: true
//     // })))
//     .pipe(gulp.dest(paths.outputImages))
//     .pipe($.size({title: 'images'}));
// });
gulp.task('images', () => {
  return gulp.src(paths.images)
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest(paths.outputImages))
    .pipe($.size({title: 'images'}));
});
