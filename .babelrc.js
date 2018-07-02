const presets = [
  ['@babel/preset-env', {
    'targets': {
      'node': 'current'
    },
    debug: process.env.BABEL_ENV === 'development',
    modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false
  }]
];

module.exports = { presets };
