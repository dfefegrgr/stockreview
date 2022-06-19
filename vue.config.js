const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: 'http://101.34.30.52:5298/',
  }
}