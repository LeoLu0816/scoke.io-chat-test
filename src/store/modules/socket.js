/**
 * socket
 */
module.exports = () => {
  return {
    namespaced: true,
    state: {
      socket: []
    },
    mutations: {
      setSocket (state, data) {
        state.socket = data
      }
    },
    getters: {
      getSocket (state) {
        return () => {
          return state.socket
        }
      }
    }
  }
}
