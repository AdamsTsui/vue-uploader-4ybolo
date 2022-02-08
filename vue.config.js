const url = 'http://192.168.97.220:9999'

module.exports = {
  lintOnSave: true,
  productionSourceMap: true,
  css: { extract: false },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./example/main.js').end()
    })
  },

  // 配置代理
  devServer: {
    disableHostCheck: true,
    port: 8083,
    proxy: {
      '/video': {
        target: url,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/video': '/video'
        }
      }
    }
  }
}
