export default {
  'notification.app.register' ({ getters }) {
    if (getters.getToken) {
        getters.socket.emit('register',{ token: getters.getToken })
    }
  },

  'notification.app.registered' ({ commit }) {    
    commit('setNotificationsRegistered')
  },

  'notification.refresh.full' ({ commit }, notifications) {
    commit('notifications', notifications);
  },

  'notification.markread.all' ({ getters }) {
    if (getters.socket.registered) {
        getters.socket.emit('markread.all')
    }
  }
}
