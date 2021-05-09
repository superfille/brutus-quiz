import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended';
import App from '@/App.vue'
import router from '@/router/index'
import vuetify from '@/plugins/vuetify'
import socketio from 'socket.io-client';

const socket = socketio('http://localhost:3000');

Vue.use(VueSocketIOExt, socket);

Vue.config.productionTip = false

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
