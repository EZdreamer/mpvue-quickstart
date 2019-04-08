var path = require('path')
var config = require('../config')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const filePath = path.resolve(__dirname, '../src/router/index.js')
const file = require(filePath)

function ImportantComponent() {
  let results = [],
    plugins = []
  file.pages.forEach(page => {
    if (!page.config || !page.config.usingComponents) return
    for (let ket in page.config.usingComponents) {
      ket.split('-')[0] === 'wux' && results.push(ket.split('-')[1])
    }
  })
  results = [...new Set(results)]
  results.forEach(c => {
    plugins.push(new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../node_modules/wux-weapp/dist/' + c),
      to: path.resolve(config.build.assetsRoot, './static/wux/' + c)
    }]))
  })
  plugins.push(new CopyWebpackPlugin([{
    from: path.resolve(__dirname, '../node_modules/wux-weapp/dist/helpers'),
    to: path.resolve(config.build.assetsRoot, './static/wux/helpers')
  }]))
  return plugins
}

module.exports = ImportantComponent
