import path from 'path';

function root(_path) {
  return path.join(__dirname, _path);
}

const appRoot = 'app/';
const outputRoot = 'dist/';
const tmpRoot = '.tmp/';
const karmaConf = root('../karma.conf.js');

function root(_path) {
  return path.join(__dirname, _path);
}

export default {
  root: appRoot,
  scripts: `${appRoot}**/*.js`,
  scriptMain: `${appRoot}scripts/main`,
  templates: [`${appRoot}**/*.{html,nunjucks}`],
  templatesMain: `${appRoot}index.html`,
  templatesNunjucks: `${appRoot}**/*.nunjucks`,
  images: [`${appRoot}images/**`, `${appRoot}**/images/**`],
  fonts: [`${appRoot}fonts/**`, `${appRoot}**/fonts/**`],
  styles: [`${appRoot}**/*.{scss,css}`],
  styleguideOverview: `${appRoot}styleguide/readme.md`,
  cssMain: `${appRoot}styles/style.scss`,
  output: outputRoot,
  build: `${outputRoot}**/*`,
  scriptMainOutput: `${outputRoot}scripts/main.min.js`,
  outputImages: `${outputRoot}images`,
  outputFonts: `${outputRoot}fonts`,
  outputStyleguide: `${outputRoot}styleguide`,
  outputStyleguidePath: '/styleguide',
  tmp: tmpRoot,
  tmpStyle: `${tmpRoot}styles`,
  tmpStyleguide: `${tmpRoot}styleguide`,
  serveAltPaths: {
        '/bower_components': 'bower_components',
        '/jspm_packages': 'jspm_packages',
        '/node_modules': 'node_modules',
        '/system.config.js':'system.config.js'
      },
  doc:'./doc',
  backstop: './node_modules/backstopjs',
  karmaConf: karmaConf,
  changelog: root('../CHANGELOG.md'),
  package: root('../package.json'),
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/'
};
