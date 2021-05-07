import Vue from 'vue'
import VueSocketIO from 'vue-socket.io';
import App from '@/App.vue'
import router from '@/router/index'
import vuetify from '@/plugins/vuetify'
import socketio from 'socket.io-client';

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: socketio('http://localhost:3000'),
}))

new Vue({
  sockets:{
    connect: () => {
      console.log('socket connected')
    },
    customEmit: () => {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
