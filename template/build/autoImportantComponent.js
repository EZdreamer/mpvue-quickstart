var path = require('path')
var fs = require('fs')
var config = require('../config')
var CopyWebpackPlugin = require('copy-webpack-plugin')
const filePath = path.resolve(__dirname, '../src/router/index.js')
const file = require(filePath)

function ImportantComponent() {

  let results = [],
    plugins = []
  file.pages.forEach(page => {
    if (!page.config || !page.config.usingComponents) return
    const getC = function(usingComponents) {
      for (let key in usingComponents) {
        if (key.split('-')[0] !== 'wux') continue
        const c = key.split('-')[1]
        results.push(c)
        try {
          const f = path.resolve(__dirname, '../node_modules/wux-weapp/dist/' + c + '/index.json')
          let date = fs.readFileSync(f, 'utf-8')
          date = JSON.parse(date)
          if (!date.usingComponents) continue
          getC(date.usingComponents)
        } catch (e) {
          console.log(chalk.yellow('组件依赖引入可能失败'))
        }
      } 
    }
    getC(page.config.usingComponents)
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

ImportantComponent()

module.exports = ImportantComponent
