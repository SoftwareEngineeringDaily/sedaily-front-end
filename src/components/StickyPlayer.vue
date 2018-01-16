<template>
  <div id='sticky-player'>
    <a-player :music="{
      title: this.activePlayerPost.title.rendered || ' ',
      url: this.activePlayerPost.mp3 || ' ' ,
      pic: this.activePlayerPost.featuredImage || ' '
    }" />
  </div>
</template>

<script>
/* @flow */
import AudioPlayer from 'components/AudioPlayer.vue'
import { mapState } from 'vuex'

export default {
  name: 'sticky-player',
  components: {
    'a-player': AudioPlayer
  },
  computed: {
    ...mapState(['activePlayerPost'])
  }
}
</script>
