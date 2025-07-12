const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')
const dotenv = require('dotenv') // Importar dotenv

// Carregar variáveis de ambiente do .env
dotenv.config() // Isso carregará as variáveis do .env para process.env

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  // Definir as variáveis de ambiente que serão injetadas no código do cliente
  // Cada variável process.env.REACT_APP_... é definida individualmente
  const clientEnv = Object.keys(process.env)
    .filter((key) => key.startsWith('REACT_APP_'))
    .reduce((acc, key) => {
      acc[`process.env.${key}`] = JSON.stringify(process.env[key]) // Prefixa com 'process.env.' e stringify
      return acc
    }, {})

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
      // Adicione o DefinePlugin para injetar variáveis de ambiente
      // Agora, cada variável é definida como 'process.env.SUA_VARIAVEL_AQUI'
      new webpack.DefinePlugin(clientEnv),
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
