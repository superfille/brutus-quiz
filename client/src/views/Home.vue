<template>
  <div>
    <Signup v-if="!hasSignedUp" @joinRoom="joinRoom" />

    <Game v-if="hasSignedUp" :player="player" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { joinRoomAction } from '@/services/socket-actions'
import { joinedRoomSubscription } from '@/services/socket-subscriptions'
import { JoinedRoomInformation, JoinRoomInformation, Player } from '@/interfaces/interfaces';
import Signup from '@/views/Signup.vue';
import Game from '@/views/Game.vue';

@Component({
  components: {
    Signup,
    Game,
  },
})
export default class Home extends Vue {
  private hasSignedUp = false;
  private player: Player | null = null;

  private created() {
    joinedRoomSubscription(this.$socket.client, (info: JoinedRoomInformation) => {
      if (info.status === 200) {
        this.hasSignedUp = true;
        this.player = {
          name: info.name,
          playerId: info.playerId ?? '',
          roomId: info.roomId ?? '',
          answers: [],
          isAdmin: info.name.toLowerCase() === 'filip',
        }
      }
    })
  }

  private joinRoom(joinRoomInfo: JoinRoomInformation) {
    joinRoomAction(this.$socket.client, joinRoomInfo);
  }
}
</script>
