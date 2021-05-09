<template>
  <div>
    <v-sheet :elevation="2" class="pa-6">
      <v-container>
        <h2>Welcome, please choose your username and room</h2>
      </v-container>
      <v-form>
        <v-container class="pa-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="username"
                label="Username"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="roomId"
                label="Roomid"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-btn @click="joinRoom">Go</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  private username = '';
  private roomId = '';

  private joinRoom() {
    // this.$router.push('/game')
    console.log(this.username, this.roomId)
    this.$socket.client.emit('join room', { username: this.username, roomId: this.roomId })

    this.$socket.$subscribe('joined game')
  }
}
</script>
