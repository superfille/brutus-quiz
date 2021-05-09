<template>
  <div>
    <v-sheet :elevation="2" class="pa-6">
      <v-container>
        <h2>Welcome, please choose your name and room</h2>
      </v-container>
      <v-form>
        <v-container class="pa-6">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="name"
                label="Name"
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
import { joinRoomAction } from '@/services/socket-actions'
import { joinedRoomSubscription, nextQuestion } from '@/services/socket-subscriptions'
import { JoinedRoomInformation, Question } from '@/interfaces/interfaces';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  private name = '';
  private roomId = '';

  private created() {
    joinedRoomSubscription(this.$socket.client, (info: JoinedRoomInformation): void => {
      console.log('in here', info);
      if (info.status === 200) {
        nextQuestion(this.$socket.client, (q: Question) => {
          console.log(q);
        });
        
      }
    })
  }

  private joinRoom() {
    joinRoomAction(this.$socket.client, { name: this.name, roomId: this.roomId });
  }
}
</script>
