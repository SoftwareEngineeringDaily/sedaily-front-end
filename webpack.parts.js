const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

exports.assetsPath = (_path) => {
  return path.posix.join('static', _path)
}

exports.cssLoaders = ({ sourceMap, extract } = {}) => {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: isProduction,
      sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

exports.cssExtractor = () => ({
  plugins: [
    new ExtractTextPlugin({
      filename: exports.assetsPath('css/[name].[contenthash].css')
    })
  ]
})

exports.cssOptimizer = () => ({
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
})

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = (options) => {
  const rules = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    rules.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return {
    module: {
      rules
    }
  }
}

exports.fileLoaders = () => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: exports.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: exports.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
})

exports.jsLoaders = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include,
        exclude,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: exports.cssLoaders({
            sourceMap: isProduction,
            extract: isProduction
          })
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include,
        exclude
      }
    ]
  }
})

exports.copy = ({ from, to } = {}) => ({
  plugins: [
    new CopyWebpackPlugin([
      {
        from,
        to,
        ignore: ['.*']
      }
    ])
  ]
})

exports.clean = (path, { exclude } = {}) => ({
  plugins: [new CleanWebpackPlugin([path], { exclude })]
})

exports.devServer = ({ host, port, open = true, hot = true, quiet = false } = {}) => ({
  devServer: {
    host,
    port,
    open,
    hot,
    quiet,
    overlay: true,
    stats: 'errors-only'
  }
})
