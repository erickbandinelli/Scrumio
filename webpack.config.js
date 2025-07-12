const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const dotenv = require('dotenv')

// Carregar variáveis de ambiente do .env
dotenv.config()

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  // Define as variáveis de ambiente que serão injetadas no código do cliente
  // Garante que 'process.env' existe e injeta as variáveis REACT_APP_ nele.
  const definedEnv = {
    // Explicitamente define 'process' como um objeto global vazio se ele não existir.
    // Isso é uma medida de segurança para garantir que 'process' esteja definido.
    process: '{}',
    // Define 'process.env' como um objeto vazio para começar.
    'process.env': {},
    // Define NODE_ENV, que é frequentemente usado por bibliotecas.
    'process.env.NODE_ENV': JSON.stringify(
      isProduction ? 'production' : 'development'
    )
  }

  // Adiciona todas as variáveis de ambiente que começam com REACT_APP_
  // Elas serão injetadas como propriedades de 'process.env'
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
      // Use o DefinePlugin para injetar as variáveis de ambiente
      new webpack.DefinePlugin(definedEnv),
      // Adiciona um plugin para injetar um polyfill para 'process' no início do bundle
      new webpack.ProvidePlugin({
        process: 'process/browser' // Isso injeta um polyfill para 'process'
      }),
      // Adicione o BundleAnalyzerPlugin apenas em modo de produção
      isProduction &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static', // Gera um arquivo HTML estático
          reportFilename: 'bundle-report.html', // Nome do arquivo de relatório
          openAnalyzer: false // Não abre automaticamente no navegador
        })
    ].filter(Boolean), // Filtra plugins nulos (para quando isProduction é falso)
    devServer: {
      historyApiFallback: true, // Necessário para o React Router DOM
      port: 3000
    },
    optimization: {
      splitChunks: {
        chunks: 'all' // Otimiza a divisão de chunks para todos os tipos de módulos
        // Você pode configurar minSize, maxSize, cacheGroups aqui para controle mais granular
      }
    }
  }
}
