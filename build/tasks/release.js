import gulp from 'gulp';
import fs from 'fs-extra';
import runSequence from 'run-sequence';
import bump from 'gulp-bump';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import changelog from 'conventional-changelog';
import paths from '../paths';
import pkg from '../../package.json';

//Bump version from GIT commit messages
gulp.task('bump', () => {
  //release();
  conventionalRecommendedBump({
    preset: 'angular'
  }, (err, releaseAs) => {
    console.log('releaseAs', releaseAs);
    console.log('err', err);
    gulp.src(paths.package)
    .pipe(bump({type: releaseAs}))
    .pipe(gulp.dest('./'));
  });
  console.log('bumped');
});

gulp.task('changelog', () => {
  return changelog({
    preset: 'angular',
    releaseCount: 0
  })
  .pipe(fs.createWriteStream(paths.changelog));
});

gulp.task('release', cb => {
  runSequence(
    'bump',
    'changelog',
    'deploy'
    cb
  );
});
