const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

// Carregar variáveis de ambiente do .env
// dotenv.config(); // Removido, pois a Vercel já injeta

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  // Define as variáveis de ambiente que serão injetadas no código do cliente
  const definedEnv = {
    process: '{}',
    'process.env': {},
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
    entry: './src/main.tsx', // Seu ponto de entrada principal
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true, // Limpa o diretório 'dist' antes de cada build
      publicPath: '/' // Importante para o React Router DOM
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
          use: ['style-loader', 'css-loader', 'postcss-loader'] // Certifique-se de que postcss-loader está configurado
        }
        // Adicione regras para outros tipos de arquivos se você os estiver usando (ex: imagens, fontes)
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html' // Seu arquivo HTML de template
      }),
      new webpack.DefinePlugin(definedEnv),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
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
      minimize: false, // TEMPORARIAMENTE DESATIVADO PARA DEBUG: Habilita a minificação em produção
      // minimizer: [ // Comentado para desativar o Terser
      //   new TerserPlugin({
      //     terserOptions: {
      //       ecma: 2024,
      //       compress: {},
      //       output: {
      //         comments: false,
      //       },
      //       sourceMap: false,
      //     },
      //     extractComments: false,
      //   }),
      // ],,
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}
