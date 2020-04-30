<template>
  <div class="admin-user">
    <h2> User </h2>
    <b-pagination v-model="currentPage" :total-rows="filtered ? filtered.length : 0" :per-page="perPage" align="right"/>

    <div class="users-table">
      <div v-if="loading" class="cover"><spinner :show="true"/></div>

      <div class="users-table-navbar">
        <input type="text" @input="onSearch" placeholder="Search" autofocus class="form-control">
        <div class="users-table-filters">
          Total: {{users.length}} Users |
          Quick filters:
          <button :class="{'filter-admin-on': filterAdmin}" @click="onClickFilterAdmin">Admin</button>
        </div>
      </div>

      <div class="users-table-header">
        <div class="table-col col-avatar"></div>
        <div class="table-col size-3">Name</div>
        <div class="table-col size-1 center">Action</div>
      </div>

      <div class="users-table-row" v-for="user in filteredPage" :key="user._id">
        <div v-if="user.saving" class="cover"><spinner :show="true"/></div>
        <div class="table-col col-avatar">
          <Avatar width="40px" :user="user" />
        </div>
        <div class="table-col size-3">
          <div>{{user.name}} {{user.lastName}}</div>
          <div class="user-info">{{user.email}}</div>
        </div>
        <div class="table-col size-1 center actions">
          <button :class="{'active': user.isAdmin}" @click="onClickSetAdmin(user)">Admin</button>
        </div>
      </div>
    </div>

    <b-pagination v-model="currentPage" :total-rows="filtered ? filtered.length : 0" :per-page="perPage" align="right"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { debounce } from 'lodash'
import Spinner from "@/components/Spinner.vue";
import Avatar from '@/components/Avatar'
import SelectUserInput from '@/components/SelectUserInput'

export default {
  name: 'admin-user',
  components: {
    Avatar,
    Spinner,
    SelectUserInput
  },
  beforeMount () {
    this.fetchUsers()
  },
  data () {
    return {
      loading: false,
      users: [],
      search: '',
      currentPage: 1,
      perPage: 10,
      filterAdmin: false
    }
  },
  computed: {    
    filtered () {
      let result = this.users
      if (this.filterAdmin) {
        result = this.users.filter(user => user.isAdmin)
      }
      if (!this.search) return result
      return result.filter((user) => {
        return new RegExp(this.search, 'i').test(user.name) 
          || new RegExp(this.search, 'i').test(user.LastName)
          || new RegExp(this.search, 'i').test(user.email)
      })
    },

    filteredPage () {
      if (!this.filtered) return []
      return this.filtered.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    }
  },
  methods: {
    ...mapActions(['getUsers', 'updateUser']),

    fetchUsers () {
      this.loading = true

      this.getUsers().then((data) => {
        this.users = data.map(user => ({ ...user, saving: false }))
      }).catch((e) => {
        this.$toasted.error(e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    onClickSetAdmin (user) {
      user.saving = true

      const fields = {
        isAdmin: !user.isAdmin
      }

      this.updateUser({ userId: user._id, fields }).then((data) => {
        this.fetchUsers()
      }).catch((e) => {
        this.$toasted.error(e, { duration : 0 })
      }).finally(() => {
        user.saving = false
      })
    },

    onSearch: debounce(function(event) {
      this.search = event.target.value
    },200),
    
    onClickFilterAdmin () {
      this.filterAdmin = !this.filterAdmin
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../css/variables'

  .admin-user
    
    .users-table
      margin-bottom 20px
      position relative

      .spinner
        margin: 0 auto;
        display: inherit;
      
      .cover
        background-color rgba(255,255,255,0.8)
        padding 0 20px
        position absolute
        width 100%
        height 100%
        display flex
        align-items center
        z-index 10

      .users-table-navbar
        padding 10px
        border 1px solid #cecece
        margin-top -1px
        border-radius 3px 3px 0 0

      .users-table-filters
        margin-top 5px
        color #999
        font-size 12px

        button
          background-color transparent
          border 1px solid #cecece
          border-radius 30px
          color #666
          outline 0
        
        .filter-admin-on
          background-color #222
          color #fff
          border-color #222

      .users-table-header
        font-weight  700
        background-color #fbfbfb

      .users-table-header, .users-table-row    
        border 1px solid #cecece
        margin-top -1px
        display flex
        min-height 65px
        position relative

        .table-col
          padding 5px 10px
          align-self center

        .size-1
          flex 1
        
        .size-3
          flex 3
        
        .center
          text-align center
        
        a
          background-color inherit
          border 1px solid primary-color
          padding 5px 10px
          color primary-color
          border-radius 30px

        .col-avatar
          width 60px

        .user-info
          margin-top 5px
          color #888
          font-size 12px

        .actions

          button
            background-color transparent
            border 1px solid #cecece
            border-radius 30px
            color #999
            outline 0
          
          .active
            background-color main-purple
            color #fff
            border-color main-purple

    >>> .page-link 
      color primary-color

    >>> .page-item.active .page-link 
      z-index 1
      color #fff
      background-color primary-color
      border-color primary-color
</style>
