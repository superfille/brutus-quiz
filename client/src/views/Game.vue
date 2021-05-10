<template>
  <div class="game">
    <v-container v-if="!gameStarted">
      <h2>Waiting for more players..</h2>

      <v-btn v-if="player.isAdmin" @click="startGame">Start game</v-btn>
    </v-container>

    <v-container v-if="gameStarted">
      Started game
    </v-container>
  </div>
</template>

<script lang="ts">
import { Player, Question } from '@/interfaces/interfaces';
import { startGameAction } from '@/services/socket-actions';
import { nextQuestion } from '@/services/socket-subscriptions';
import { Component, Prop, Vue } from 'vue-property-decorator';



@Component({
  components: {
  },
})
export default class Game extends Vue {
  @Prop({ default: null }) player?: Player | null;

  private gameStarted = false;

  private created() {    
    nextQuestion(this.$socket.client, (q: Question) => {
      console.log(q);
      this.gameStarted = true;
    });
  }

  private startGame() {
    startGameAction(this.$socket.client, this.player?.roomId ?? '');
  }
}
</script>
