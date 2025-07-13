const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  // Define as variáveis de ambiente que serão injetadas no código do cliente
  // Agora apenas as variáveis REACT_APP_ são definidas, sem tentar definir 'process' globalmente.
  const definedEnv = {
    'process.env.NODE_ENV': JSON.stringify(
      isProduction ? 'production' : 'development'
    )
  }

  for (const key in process.env) {
    if (key.startsWith('REACT_APP_')) {
      definedEnv[`process.env.${key}`] = JSON.stringify(process.env[key])
    }
  }

  return {
    entry: './src/main.tsx',
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new webpack.DefinePlugin(definedEnv),
      isProduction &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: false
        })
    ].filter(Boolean),
    devServer: {
      historyApiFallback: true,
      port: 3000
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 2024,
            compress: {},
            output: {
              comments: false
            },
            sourceMap: false
          },
          extractComments: false
        })
      ],
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}
