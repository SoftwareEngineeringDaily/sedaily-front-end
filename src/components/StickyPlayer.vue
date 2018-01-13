<template>
  <div id='sticky-player'>

        <a-player :music="{
          title: this.$store.state.activePlayerPost.title.rendered || ' ',
          author: ' ',
          url: this.$store.state.activePlayerPost.mp3 || ' ' ,
          pic: this.$store.state.activePlayerPost.featuredImage || ' ',
          lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
        }"></a-player>

  </div>
</template>

<script>
/* @flow */
import AudioPlayer from './AudioPlayer.vue'

export default {
  name: 'sticky-player',
  components: {
    'a-player': AudioPlayer
  },
  data () {
    return {
      playingPost: null
    }
  }
}
</script>

<style scoped lang="stylus">
#bigDiv
  height 150vh

#toolbar
  position sticky
  top 1px
</style>
