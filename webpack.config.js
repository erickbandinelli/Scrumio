const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true
  },
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public') // ou 'dist' se não usar 'public'
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // --- Nova regra para CSS ---
      {
        test: /\.css$/, // Testa arquivos que terminam com .css
        use: [
          'style-loader', // Injeta CSS no DOM via <style> tags
          'css-loader', // Interpreta @import e url() como import/require()
          {
            loader: 'postcss-loader', // Processa CSS com PostCSS (para Tailwind e Autoprefixer)
            options: {
              postcssOptions: {
                // Aqui você pode referenciar seu postcss.config.js
                // Se postcss.config.js estiver na raiz, Webpack o encontrará automaticamente.
                // Caso contrário, você pode especificar os plugins diretamente aqui.
                plugins: [require('tailwindcss'), require('autoprefixer')]
              }
            }
          }
        ]
      }
      // --- Fim da nova regra para CSS ---
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html' // ou './src/index.html'
    })
  ]
}
