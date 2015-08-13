import path from 'path';

const appRoot = 'app/';
const outputRoot = 'dist/';
const tmpRoot = '.tmp/';
const karmaConf = path.join(__dirname, '../karma.conf.js');

export default {
  root: appRoot,
  scripts: appRoot + '**/*.js',
  scriptMain: appRoot + 'scripts/main',
  templates: appRoot + '**/*.html',
  templatesMain: appRoot + 'index.html',
  images: [appRoot + 'images/**', appRoot + '**/images/**'],
  fonts: [appRoot + 'fonts/**', appRoot + '**/fonts/**'],
  styles: [appRoot + '**/*.{scss, css}'], //appRoot + '**/*.css'],
  styleguideOverview: appRoot + 'styleguide/readme.md',
  cssMain: appRoot + 'styles/style.scss',
  output: outputRoot,
  scriptMainOutput: outputRoot + 'scripts/main.min.js',
  outputImages: outputRoot + 'images',
  outputFonts: outputRoot + 'fonts',
  outputStyleguide: outputRoot + 'styleguide',
  tmp: tmpRoot,
  tmpStyle: tmpRoot + 'styles',
  tmpStyleguide: tmpRoot + 'styleguide',
  serveAltPaths: {
        '/bower_components': 'bower_components',
        '/jspm_packages': 'jspm_packages',
        '/system.config.js':'system.config.js'
      },
  doc:'./doc',
  karmaConf: karmaConf,
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/'
};
