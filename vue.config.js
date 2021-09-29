module.exports = {
  lintOnSave: false,
  publicPath:
    process.env.NODE_ENV === 'production' ? '/vk-activities/' : '/',
  devServer: {
    host: 'localhost',
  },
  transpileDependencies: ['vuetify'],
}
