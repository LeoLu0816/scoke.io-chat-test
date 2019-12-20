let Vue = require('vue')
let Vuex = require('vuex')
Vue.use(Vuex)

// 載入 modules
let modules = {}
let modulesContext = require.context('./modules/', false, /\.js$/)
modulesContext.keys().map(fileName => {
  let moduleName = fileName.substr(2, fileName.length - 5)
  modules[moduleName] = modulesContext(fileName)()
})

module.exports = new Vuex.Store({ modules })
