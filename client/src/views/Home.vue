<template>
  <div class="home">
    <button @click="onClick">Click</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  private onClick() {
    this.$router.push('/game')
  }
}
</script>
