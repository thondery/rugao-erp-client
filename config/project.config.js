const path = require('path')
const argv = require('yargs').argv
const debug = require('debug')('app:config:project')
const pkg = require('../package.json')

debug('Creating default configuration.')
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env     : process.env.NODE_ENV || 'development',
  history : process.env.HISTORY || '',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : 'src',
  dir_dist   : '../rugao-erp-server/public',
  dir_public : 'public',
  dir_server : 'server',
  dir_test   : 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : 'localhost', // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || 4000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel           : {
    cacheDirectory : true,
    presets        : ['es2015', 'react', 'stage-0'],
    plugins        : [
      //'transform-runtime', 
      'transform-decorators-legacy',
      'react-hot-loader/babel',
      'lodash', 
      ['import', [
        { 
          'libraryName': 'antd', 
          'libraryDirectory': 'lib',
          'style': 'css' 
        }
      ]]
    ],
    //compact        : true
  },
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : {
    chunks       : false,
    chunkModules : false,
    colors       : true
  },
  compiler_vendors : [
    'babel-polyfill',
    'isomorphic-fetch',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-dom',
    'react-router-redux',
    'redux',
    'redux-thunk',
    //'http-services'
  ],

}

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__TEST__'     : config.env === 'test',
  '__DESKTOP__'  : config.history === 'desktop',
  '__COVERAGE__' : !argv.watch && config.env === 'test',
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/project.config.js`
    )
  })

config.compiler_vendors.splice(0, 0, 'react-hot-loader/patch')

// ------------------------------------
// Utilities
// ------------------------------------
function base () {
  const args = [config.path_base].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}

config.paths = {
  base   : base,
  client : base.bind(null, config.dir_client),
  public : base.bind(null, config.dir_public),
  dist   : base.bind(null, config.dir_dist)
}

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments.config')
const overrides = environments[config.env]
if (overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}

module.exports = config