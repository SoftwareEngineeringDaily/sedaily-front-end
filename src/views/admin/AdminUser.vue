<template>
  <div class="admin-user">
    <button class="button-secondary" @click="onBack"><i class="fa fa-arrow-left" /> Back</button>
    <spinner :show="loading && !user"/>
    <template v-if="user">

      <div class="block-info">
        <div class="user-info">
          <h3>{{user.name}} {{user.lastName}}</h3>
          <div class="bio">{{user.bio}}</div>
          <div>
            {{user.email}}
            <template v-if="user.twitter">
              | <a :href="twitterRoute" target="_blank">@{{user.twitter}}</a>
            </template>
          </div>
          <div v-if="user.website"><a :href="user.website" target="_blank">{{user.website}}</a></div>
          <router-link :to="profileRoute">Go to public profile</router-link>
        </div>
        <avatar width="100px" height="100px" :user="user" />
      </div>

      <div v-if="user.maintainedTopics.length" class="block-topics">
        <h4>Maintained Topics</h4>
        <div class="topic" v-for="topic in user.maintainedTopics" :key="topic._id">
          <div class="name">
            {{topic.name}}
          </div>
          <div class="actions">
            <router-link :to="`/admin/topic/${topic._id}`">Edit</router-link> |
            <router-link :to="`/topic/${topic.slug}`">See page</router-link>
          </div>
        </div>
      </div>

      <div class="block-settings">
        <h4>User Settings</h4>
        <div class="setting" v-for="setting in settings" :key="setting.field">
          <div class="name">
            {{setting.name}}
          </div>
          <div class="action">
            <spinner :show="setting.saving" />
            <switches
              @input="onChangeSetting(setting)"
              v-model="user[setting.field]" 
              :emit-on-mount="false" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Switches from 'vue-switches';
import Spinner from "@/components/Spinner.vue";
import Avatar from '@/components/Avatar'

export default {
  name: 'admin-user',
  components: {
    Avatar,
    Spinner,
    Switches
  },
  beforeMount () {
    this.fetchUser()
  },
  data () {
    return {
      loading: false,
      saving: true,
      user: false,
      settings: [{
        name: 'Admin',
        field: 'isAdmin',
        saving: false
      },{
        name: 'Blocked for topic edition',
        field: 'blockedTopicEdit',
        saving: false
      }]
    }
  },
  computed: {    
    profileRoute () {
      if (!this.user) return '/'
      return { name: 'PublicProfile', params: { id: this.user._id }}
    },

    twitterRoute () {
      if (!this.user) return ''
      return `https://twitter.com/${this.user.twitter}`
    }
  },
  methods: {
    ...mapActions(['getUser', 'updateUser']),

    fetchUser () {
      this.loading = true

      this.getUser(this.$route.params.id).then((data) => {
        this.user = data
      }).catch((e) => {
        this.$toasted.error(e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    onChangeSetting (setting) {
      setting.saving = true 

      const fields = {
        [setting.field]: this.user[setting.field]
      }

      this.updateUser({ userId: this.user._id, fields }).then((data) => {
        this.fetchUser()
      }).catch((e) => {
        this.$toasted.error(e, { duration : 0 })
      }).finally(() => {
        setting.saving = false
      })
    },

    onBack () {
      this.$router.go(-1)
    }

  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'

>>> .vue-switcher
  margin 0

>>> .vue-switcher-theme--default.vue-switcher-color--default div
  background-color main-purple
  &:after
    background-color #8270d6

.admin-user
  .spinner
    margin: 0 auto
    display block
  
  .button-secondary
    background-color inherit
    border 1px solid #222
    padding 7px 10px
    font-size 12px
    color #222
    border-radius 30px

    &:hover
      outline none

    &:focus
      outline none
  
  .block-info
    margin-top 20px
    margin-bottom 40px
    display flex

    .user-info
      flex 1

      .bio
        color #999
      
      div
        margin-bottom 5px
      
      a
        text-decoration underline
  
  .block-topics
    .topic
      padding 10px
      margin-bottom 5px
      background-color #f8f9fa
      display flex
      color #666

      .name
        flex 1
      
      .actions

        a
          color #666
          text-decoration underline
  
  .block-settings
    margin-top 20px

    .setting
      padding 20px 10px
      margin-bottom 5px
      display flex
      align-items center
      color #666

      .name
        flex 1
      
      .action
        display flex
        align-items center
        height 22px

        .spinner
          margin auto
          display inline-block
          width 22px
          height 22px
        
        label
          margin-left 20px

</style>
