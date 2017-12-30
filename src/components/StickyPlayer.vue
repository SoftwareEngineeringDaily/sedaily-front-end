<template>
  <div id='sticky-player'>
    <a-player v-if="music" :music="music" autoplay ref="player"></a-player>
  </div>
</template>

<script>
import APlayer from 'vue-aplayer'
import { mapState } from 'vuex'

export default {
  name: 'sticky-player',
  data () {
    return {
      music: null
    }
  },
  components: {
    'a-player': APlayer
  },
  computed: {
    ...mapState(['activePlayerPost'])
  },
  watch: {
    activePlayerPost (newValue) {
      this.music = null

      if (newValue && newValue.mp3) {
        this.$nextTick(() => {
          this.music = {
            title: newValue.title.rendered || ' ',
            author: 'Software Engineering Daily Podcast',
            url: newValue.mp3 || ' ',
            pic: newValue.featuredImage || ' ',
            lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#bigDiv
  height 150vh

#toolbar
  position sticky
  top 1px  
</style>
