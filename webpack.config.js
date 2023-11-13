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
      filename: 'index.js',
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
          use: ['babel-loader'],
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
        filename: '[name].css',
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