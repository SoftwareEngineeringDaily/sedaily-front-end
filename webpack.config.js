const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const parts = require('./webpack.parts')

const PATHS = {
  app: path.join(__dirname, 'src'),
  components: path.join(__dirname, 'src', 'components'),
  build: path.join(__dirname, 'dist'),
  static: path.join(__dirname, 'static')
}

const commonConfig = merge([
  {
    entry: {
      main: [
        'babel-polyfill',
        'jquery',
        './src/index.js'
      ]
    },
    output: {
      filename: '[name].js',
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': PATHS.app,
        'components': PATHS.components
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ]
  },
  parts.jsLoaders({ include: [PATHS.app] }),
  parts.fileLoaders()
])

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST, // default localhost
    port: process.env.PORT // default 8080
  }),
  {
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsPlugin(),
      new webpack.EnvironmentPlugin({
        API_ENV: 'development' // default - can be overridden by npm script
      })
    ]
  },
  parts.styleLoaders({ sourceMap: false })
])

const testConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
    open: false,
    hot: false,
    quiet: true
  }),
  {
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      new webpack.EnvironmentPlugin({
        API_ENV: 'development'
      })
    ]
  },
  parts.styleLoaders({ sourceMap: false })
])

const productionConfig = merge([
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },
    output: {
      path: PATHS.build,
      filename: parts.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: parts.assetsPath('js/vendor.[chunkhash].js')
    }
  },
  {
    plugins: [
      new HtmlWebpackPlugin({
        filename: path.join(PATHS.build, 'index.html'),
        template: 'index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      }),
      new webpack.EnvironmentPlugin({
        API_ENV: 'production'
      })
    ]
  },
  parts.copy({ from: PATHS.static, to: path.join(PATHS.build, 'static') }),
  parts.styleLoaders({ sourceMap: true, extract: true }),
  parts.cssExtractor(),
  parts.cssOptimizer(),
  parts.clean(PATHS.build)
])

module.exports = env => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig, { mode: env })
  }

  if (env === 'test') {
    return merge(commonConfig, testConfig, { mode: 'development' })
  }

  return merge(commonConfig, developmentConfig, { mode: 'development' })
}
