/* global HTMLElement DEBUG */
require('babel-polyfill')
let Vue = require('vue')
let store = require('./store')
let socketConnection = require('socket.io-client')
let EventEmitter = require('events')
let App = Vue.extend(require('./App.vue'))

class JBChatPlugin extends EventEmitter {
  constructor () {
    super()
    this._vue = null
    this._socket = null
  }

  /**
   * 執行
   * @param {HTMLElement} container 畫面容器
   */
  run (container, config) {
    const self = this

    // 如果傳進來的對象是 jQuery DOM，就改取他最原本的 DOM
    if (!(container instanceof HTMLElement)) {
      container = container[0]
    }

    /**
     * 連線至Server
     */
    const socket = socketConnection(config.serverUrl.url, {
      path: config.serverUrl.path,
      query: config.serverUrl.query,
      transports: ['websocket'],
      reconnection: false
    })
    self._socket = socket

    // 建立連線
    socket.on('connect', onConnected)
    function onConnected () {
      DEBUG && console.log(`socket is connected.`, socket)
      store.commit('socket/setSocket', socket)
      self._vue = new App({
        el: container,
        store,
        computed: {
          socket: () => socket,
          userData: () => config.userData
        }
      })
    }

    // 連線失敗
    socket.on('connect_error', e => {
      console.log(`connect_error`)
    })

    // 連線成功，但之後中斷了
    socket.on('disconnect', e => {
      console.log(`disconnect`)
    })
  }
};

module.exports = new JBChatPlugin()
