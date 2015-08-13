import gulp from 'gulp';
import swPrecache from 'sw-precache';
import path from 'path';
import fs from 'fs-extra';
import paths from '../paths';
import pkg from '../../package.json';
// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
gulp.task('generate-service-worker', cb => {
  const rootDir = paths.output;

  swPrecache({
    cacheId: pkg.name || 'project-fusion',
    staticFileGlobs: [
      '${rootDir}fonts/**/*.woff',
      '${rootDir}images/**/*',
      '${rootDir}scripts/**/*.js',
      '${rootDir}styles/**/*.css',
      '${rootDir}*.{html,json}'
    ],
    stripPrefix: path.join(rootDir, path.sep)
  }, (err, swFileContents) => {
    if (err) {
      cb(err);
      return;
    }

    const filepath = path.join(rootDir, 'service-worker.js');

    fs.writeFile(filepath, swFileContents, err => {
      if (err) {
        cb(err);
        return;
      }

      cb();
    });
  });
});
