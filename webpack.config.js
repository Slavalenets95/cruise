const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const templates = {
  footerEn: fs.readFileSync('./src/htmlParts/footerEn.html', { encoding: 'utf-8' }),
  footerAr: fs.readFileSync('./src/htmlParts/footerAr.html', { encoding: 'utf-8' })
}
const pagesEn = fs.readdirSync('./src/pages/en/').map(name => {
  let nameWithoutExt = path.parse(name).name;
  if (nameWithoutExt.includes('destination-')) {
    nameWithoutExt = nameWithoutExt.replace('destination-', '');
  }
  let header = fs.readFileSync('./src/htmlParts/headerEn.html', { encoding: 'utf-8' });
  header = header.replace(
    '<a href="/index-ar" class="header-top__language-control" type="button">',
    `<a href="/${nameWithoutExt}-ar" class="header-top__language-control" type="button">`
  );
  header = header.replace(
    '<a class="header-language__menu-link" href="/index-ar">AR</a>',
    `<a class="header-language__menu-link" href="/${nameWithoutExt}-ar">AR</a>`
  );
  header = header.replace(
    '<a class="header-language__menu-link" href="/">English</a>',
    `<a class="header-language__menu-link" href="/${nameWithoutExt}">English</a>`
  );
  const result = {
    fileName: '',
    template: '',
    templateParameters: {
      headerEn: header,
    }
  };
  if (name.includes('destination-')) {
    result.fileName = name.replace('destination-', '');
  } else {
    result.fileName = name;
  }
  result.template = path.resolve(__dirname, './src/pages/en/' + name);

  return result;
});
const pagesAr = fs.readdirSync('./src/pages/ar/').map(name => {
  let nameWithoutExt = path.parse(name).name;
  if (nameWithoutExt.includes('destination-')) {
    nameWithoutExt = nameWithoutExt.replace('destination-', '');
  }
  let header = fs.readFileSync('./src/htmlParts/headerAr.html', { encoding: 'utf-8' });
  header = header.replace(
    '<a href="/" class="header-top__language-control" type="button">',
    `<a href="/${nameWithoutExt}" class="header-top__language-control" type="button">`
  );
  header = header.replace(
    '<a class="header-language__menu-link" href="/index-ar">AR</a>',
    `<a class="header-language__menu-link" href="/${nameWithoutExt}-ar">AR</a>`
  );
  header = header.replace(
    '<a class="header-language__menu-link" href="/">English</a>',
    `<a class="header-language__menu-link" href="/${nameWithoutExt}">English</a>`
  );
  const result = {
    fileName: null,
    template: null,
    templateParameters: {
      headerAr: header,
    }
  };
  if (name.includes('destination-')) {
    result.fileName = name.replace('destination-', '');
  } else {
    result.fileName = name;
  }
  result.fileName = result.fileName.split('.');
  result.fileName = result.fileName[0] + '-ar.html';
  result.template = path.resolve(__dirname, './src/pages/ar/' + name);

  return result;
});

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
              presets: ['@babel/preset-env'],
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
      ...pagesEn.map(page => {
        return new HtmlWebpackPlugin({
          filename: page.fileName,
          template: page.template,
          templateParameters: {
            templates: {
              ...page.templateParameters,
              footerEn: templates.footerEn
            }
          }
        })
      }),
      ...pagesAr.map(page => {
        return new HtmlWebpackPlugin({
          filename: page.fileName,
          template: page.template,
          templateParameters: {
            templates: {
              ...page.templateParameters,
              footerAr: templates.footerAr
            }
          }
        })
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