const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

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
          use: ['style-loader', 'css-loader', 'postcss-loader'] // Certifique-se de que postcss-loader está configurado
        }
        // Adicione regras para outros tipos de arquivos se você os estiver usando (ex: imagens, fontes)
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envVars),
      new HtmlWebpackPlugin({
        template: './public/index.html' // Seu arquivo HTML de template
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
