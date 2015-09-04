// Karma configuration
// Generated on Thu Jul 09 2015 17:12:55 GMT+0530 (India Standard Time)

module.exports = function(config) {
  //var browser = 'PhantomJS';
  //var babelMoreOptions = { stage: 0 };
  //if (process.env.NODE_ENV === 'development') {
    //browser = 'Chrome'; //chrome is much better, because it shows properly line numbers
  //}
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      //'app/*-spec.js'
      'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
    ],

    jspm: {
        // Edit this to your needs
        config: "system.config.js",
        loadFiles: ['app/**/*.spec.js', 'test/**/*.spec.js'],
        serveFiles: ['app/**/!(*.spec).js', 'app/**/*.html', 'app/**/*.css']
    },
    proxies : {
      '/app/': '/base/app/',
      '/test/': '/base/test/',
      '/jspm_packages/': '/base/jspm_packages/'

    },

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    //preprocessors: {
      //'app/**/!(*spec).js': ['babel', 'coverage']
   // },

    // transpile with babel since the coverage reporter throws error on ES6 syntax
    babelPreprocessor: {
      options: {
        //modules: 'system',
        sourceMap: 'inline'
      },
      sourceFileName: function(file) {
          return file.originalPath;
      }
    },
    preprocessors: {
      'app/**/*.js': ['babel', 'sourcemap', 'coverage']
    },

    coverageReporter: {
      instrumenters: {isparta: require('isparta')},
      instrumenter: {
          'app/**/*.js': 'isparta'
      },

      reporters: [
        {
            type: 'text-summary',
        },
        {
            type: 'html',
            dir: 'coverage/',
        }
      ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage', 'mocha'],

        // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
