import gulp from 'gulp';
import fs from 'fs-extra';
import runSequence from 'run-sequence';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import changelog from 'conventional-changelog';
import conventionalGithubReleaser from 'conventional-github-releaser';
import githubRemoveAllReleases  from 'github-remove-all-releases';
import gulpLoadPlugins from 'gulp-load-plugins';
import paths from '../paths';

const $ = gulpLoadPlugins();



gulp.task('bump-version', () => {
// We hardcode the version change type to 'patch' but it may be a good idea to
// use minimist (https://www.npmjs.com/package/minimist) to determine with a
// command argument whether you are doing a 'major', 'minor' or a 'patch' change.
//  return gulp.src(['./bower.json', './package.json'])
//    .pipe(bump({type: "patch"}).on('error', gutil.log))
//    .pipe(gulp.dest('./'));
  conventionalRecommendedBump({
      preset: 'angular'
    }, (err, releaseAs) => {
      console.log('releaseAs', releaseAs);
      console.log('err', err);
      gulp.src(paths.package)
      .pipe($.bump({type: releaseAs}))
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
gulp.task('conventional-changelog', function () {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe($.conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});
/*
gulp.task('changelog', () => {
  return gulp.src('CHANGELOG.md', {
    read: false
  })
    .pipe($.conventionalChangelog({
      preset: 'angular', // Or to any other commit message convention you use.
      releaseCount: 0
    }))
    .pipe(gulp.dest('./'));
});
*/

gulp.task('github-release', done => {
  conventionalGithubReleaser({
    type: "oauth",
    token: process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN // change this to your own GitHub token or use an environment variable
  }, {
    preset: 'angular', // Or to any other commit message convention you use.
    releaseCount: 0
  }, done);
});

gulp.task('github-remove-all-releases', done => {
  githubRemoveAllReleases({
    type: "oauth",
    token: process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN // change this to your own GitHub token or use an environment variable
  }, 'fusionstrings', 'project-fusion', done);
});

gulp.task('commit-changes-dev', () => {
  return gulp.src('.')
    .pipe($.git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes-dev', cb => {
  $.git.push('origin', 'develop', cb);
});

// Create and switch to a git branch
gulp.task('checkout-master', () => {
  $.git.checkout('master', err => {
    if (err) throw err;
  });
});

gulp.task('fetch', () => {
  $.git.fetch('origin', '', err => {
    if (err) throw err;
  });
});

gulp.task('pull-master', () => {
  $.git.pull('origin', 'master', err => {
    if (err) throw err;
  });
});

gulp.task('merge-master', () => {
  $.git.merge('develop', {args: '--no-ff'},  err => {
    if (err) throw err;
  });
});

gulp.task('commit-changes-master', () => {
  return gulp.src('.')
    .pipe($.git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes-master', cb => {
  $.git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', cb => {
  var version = getPackageJsonVersion();
  $.git.tag(version, 'Created Tag for version: ' + version, error => {
    if (error) {
      return cb(error);
    }
    $.git.push('origin', 'master', {args: '--tags'}, cb);
  });

  function getPackageJsonVersion () {
    // We parse the json file instead of using require because require caches
    // multiple calls so the version number won't be updated
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  };
});

gulp.task('release', callback => {
  runSequence(
    'bump-version',
    'changelog',
    //'commit-changes-dev',
    //'push-changes-dev',
    //'checkout-master',
    //'fetch',
    //'pull-master',
    //'merge-master',
    //'commit-changes-master',
    //'push-changes-master',
    //'create-new-tag',
    //'github-release',
    error => {
      if (error) {
        console.log(error.message);
      } else {
        console.log('RELEASE FINISHED SUCCESSFULLY');
      }
      callback(error);
    });
});

gulp.task('release2', () => {

});