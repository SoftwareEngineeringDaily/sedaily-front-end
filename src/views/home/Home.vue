<template>
  <div class="home-container">
    <home-left-panel />
    <router-view />
  </div>
</template>

<script>

import { HomeLeftPanel } from './'

export default {
  components: {
    HomeLeftPanel
  },
  name: 'home',
  data () {
    return {
      
    }
  }
}
</script>

<style lang="stylus" scoped>
  .home-container
    max-width 1050px
    margin 0 auto
    display flex
    justify-content space-between

  @media (max-width 750px) 
    .home-container 
      flex-direction column
    
    .row 
      display flex
      flex-wrap wrap
      margin-right 0px
      margin-left 0px
    
    .news-post 
      width 100%
      margin 15px auto
    
    .app-download 
      display flex
      flex-direction row
      flex-wrap wrap
      justify-content center
</style>