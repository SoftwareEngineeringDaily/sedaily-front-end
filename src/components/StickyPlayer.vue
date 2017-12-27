<template>
  <div id='sticky-player'>
    <a-player :music="{
      title: activePlayerPost.title.rendered || ' ',
      author: ' ',
      url: activePlayerPost.mp3 || ' ' ,
      pic: activePlayerPost.featuredImage || ' ',
      lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
    }"></a-player>
  </div>
</template>

<script>
/* @flow */
import VueAplayer from './VuePlayerClone.vue'
import { mapState } from 'vuex'

export default {
  name: 'sticky-player',
  components: {
    'a-player': VueAplayer
  },
  computed: {
    ...mapState(['activePlayerPost'])
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
