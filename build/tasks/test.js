import gulp from 'gulp';
import karma from 'karma';
import paths from '../paths';

const karmaServer = karma.server;

// Testing
gulp.task('test', (done) => {
  karmaServer.start({
    configFile: paths.karmaConf,
    singleRun: false,
    autoWatch: true
  }, done);
});
