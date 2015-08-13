import gulp from 'gulp';
import fs from 'fs-extra';
import runSequence from 'run-sequence';
import bump from 'gulp-bump';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import changelog from 'conventional-changelog';
import pkg from '../../package.json';

//Bump version from GIT commit messages
gulp.task('bump', () => {
  //release();
  conventionalRecommendedBump({
    preset: 'angular'
  }, (err, releaseAs) => {
    console.log('releaseAs', releaseAs);
    console.log('err', err);
    gulp.src('./package.json')
    .pipe(bump({type: releaseAs}))
    .pipe(gulp.dest('./'));
  });
  console.log('bumped');
});

//Generate chengelog from GIT commit messages
gulp.task('changelog', () => {
  return changelog({
    repository: pkg.repository.url,
    preset: 'angular',
    file: './CHANGELOG.md'
  }, (err, log) => {
    fs.writeFileSync('CHANGELOG.md', log);
  });
});

gulp.task('release', cb => {
  runSequence(
    'bump',
    'changelog',
    cb
  );
});
