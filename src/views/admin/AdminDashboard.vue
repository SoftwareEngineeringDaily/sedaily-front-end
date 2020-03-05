<template>
  <div class="admin-dashboard">
    <div v-if="me.isAdmin">
      <h1> Admin Dashboard </h1>
      <div class="admin-page">
        <div class="admin-menu">
          <ul>
            <li v-for="item in menuItems" :key="item.name">
              <router-link :to="item.route">{{item.name}}</router-link>
            </li>
          </ul>
        </div>
        <div class="admin-content">
          <router-view />
        </div>
      </div>
    </div>
    <div v-else>
      You don't have access to the admin dashboard.
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'admin-dashboard',
  data () {
    return {
      menuItems: [
        { name: 'Companies', route: '/admin/company'},
        { name: 'Topics', route: '/admin/topic'}
      ]
    }
  },
  computed: {
    ...mapState({
      me (state) {
        return state.me
      }
    })
  },
  methods: {
  }
}

</script>

<style scoped lang="stylus">
  .admin-dashboard
    padding 10px 20px

    .admin-page
      display flex
    
    .admin-menu
      width 200px

      ul 
        list-style none
        padding: 20px 0
        background #e9ecef
      
        a 
          color #808080
          cursor pointer
          text-decoration none
          line-height 2
          display inline-block
          width 100%
          padding 5px 20px
        
          &:hover 
            color primary-color !important

        .router-link-active
          color #856aff !important

    .admin-content
      flex 1
      padding 0 20px

    h1
      margin-bottom 40px

    >>> h2
      margin-bottom 40px
    
    >>> .button-group
      margin-top 10px

    >>> .button-submit
      outline none
      border-radius 4px
      margin-top 10px
      cursor pointer
      text-decoration none
    
    >>> .button-submit:hover
      color #ffffff

    >>> .link-button
      background-color inherit
      border 1px solid #222
      padding 5px 10px
      color #222
      border-radius 30px
      text-align center
      text-decoration none
</style>
