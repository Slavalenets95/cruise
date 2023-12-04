const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const isDev = env.development ? env.development : false;
  return {
    entry: {
      main: path.resolve(__dirname, './src/index.js'),
    },
    cache: {
      type: 'filesystem',
      allowCollectingMemory: true,
    },
    mode: isDev ? 'development' : 'production',
    output: {
      path: path.resolve(__dirname, 'assets'),
      filename: 'index[hash].js',
      assetModuleFilename: 'images/[name][ext]'
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
            },
            'sass-loader',
          ],
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          exclude: /node_modules/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024
            }
          },
          generator: {
            filename: 'fonts/[name][ext]'
          },
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          exclude: /node_modules/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          },
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          exclude: /node_modules/,
          type: 'asset/resource',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [ '@babel/preset-env'],
              plugins: ["transform-class-properties"]
          }
          }],
        }
      ]
    },
    optimization: {
      minimizer: [
        '...',
        new CssMinimizerPlugin(),
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'src/pages/en'),
      },
      watchFiles: ["src/*/*/*.html"],
      hot: true,
      compress: true,
      port: 9000,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name][hash].css',
        chunkFilename: './[name]-chunk.css',
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, './src/pages/en/index.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "index-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/index.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "all-regions.html",
        template: path.resolve(__dirname, './src/pages/en/all-regions.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "all-regions-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/all-regions.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "about-us-page.html",
        template: path.resolve(__dirname, './src/pages/en/about-us-page.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "about-us-page-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/about-us-page.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "contact-us.html",
        template: path.resolve(__dirname, './src/pages/en/contact-us.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "contact-us-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/contact-us.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "faq-page.html",
        template: path.resolve(__dirname, './src/pages/en/faq-page.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "faq-page-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/faq-page.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "cabins.html",
        template: path.resolve(__dirname, './src/pages/en/cabins.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "cabins-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/cabins.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "cruise-101.html",
        template: path.resolve(__dirname, './src/pages/en/cruise-101.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "cruise-101-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/cruise-101.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "aroya-ships.html",
        template: path.resolve(__dirname, './src/pages/en/aroya-ships.html'),
      }),
      // AR
      new HtmlWebpackPlugin({
        filename: "aroya-ships-ar.html",
        template: path.resolve(__dirname, './src/pages/ar/aroya-ships.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "404.html",
        template: path.resolve(__dirname, './src/pages/en/404.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "suite.html",
        template: path.resolve(__dirname, './src/pages/en/suite.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "restaraunt.html",
        template: path.resolve(__dirname, './src/pages/en/restaraunt.html'),
      }),
      // EN
      new HtmlWebpackPlugin({
        filename: "search-panel.html",
        template: path.resolve(__dirname, './src/pages/en/search-panel.html'),
      }),

      new webpack.HotModuleReplacementPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/images'),
            to: path.resolve(__dirname, 'assets/images')
          }
        ]
      }),
    ],
    performance: {
      hints: false,
      maxEntrypointSize: 51200000,
      maxAssetSize: 51200000
    },
  };
}