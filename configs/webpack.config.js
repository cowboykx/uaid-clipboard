const Ex = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const baseConfig = {
  mode: 'production',
  output: {
    path: projectRoot,
  },
  optimization: {
    minimize: false
  },
  cache: true
};

const webConfig = {
  entry: {
    'browser': './src/browser/index.tsx'
  },
  output: {
    filename: './out/browser/[name].js'
  },
  target: 'node',
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, '../tsconfig.browser.json')
        }
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   loader: "babel-loader"
      // },
      {
        test: /\.less|\.css$/,
        loader: Ex.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      }
    ]
  },
  plugins: [
    new Ex('./out/browser/[name].css'),
  ],
  externals: {
    "antd": "antd",
    "react": "React",
    "react-dom": "ReactDOM",
    "moment": "moment"
  }
};

const preloadConfig = {
  entry: {
    'preload': './src/preload.ts',
  },
  output: {
    filename: './out/preload/[name].js'
  },
  target: 'node',
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: path.resolve(__dirname, '../tsconfig.preload.json')
        }
      },
    ]
  },
  externals: {
    "electron": `require("electron")`
  }
}

module.exports = [
  merge(baseConfig, webConfig),
  merge(baseConfig, preloadConfig),
]
