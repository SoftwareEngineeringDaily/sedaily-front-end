<template>
    <div class="row justify-content-left">
      <h6 v-if="ownProfile" class="col-12 edit-link">
        <router-link :to="'/edit-profile'">
          Edit Profile
        </router-link>
        |
         <router-link class="link" :to="{ name: 'NotificationSettings', params: {}}">
           Edit Notification Settings
         </router-link>

      </h6>
      <div class="col col-sm-auto">
        <div class="crop-image">
          <img class="profile-img" :src="avatarUrl" />
        </div>
      </div>
      <div class="user-details col-sm-6 col-md-4">
        <h4 class="display-name">
          {{displayName}}
        </h4>
        <p class="display-bio">
          <small class="text-muted">{{displayBio}}</small>
        </p>
        <p class="display-website" v-if="userData.website">
          <a :href="userData.website | externalUrl" target="_blank"
             rel="external nofollow"
          > {{ userData.website | host }} </a>
        </p>
      <hr/>
      </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'profile-details',
    props: {
      userData: {
        type: Object,
        default: function () {
          return {
            _id: '',
            username: '',
            avatarUrl: '',
            bio: '',
            name: '',
            website: ''
          }
        }
      },
      ownProfile: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        displayName () {
          return this.userData.name || this.userData.username
        },
        displayBio () {
          return this.userData.bio || `${this.displayName} is still writing their biography`
        },
        avatarUrl (state) {
          return this.userData.avatarUrl || state.placeholderAvatar
        }
      })
    }
  }
</script>

<style scoped lang="stylus">
  @import './../css/variables'

  .user-details
    position fixed
    padding 0
    margin 0
    top 30%
    left 50%
    transform: translate(-50%, -50%)
    text-align center
    .display-name
      padding-top 50px
    .display-website a
      text-decoration none
      color primary-color
      &:hover
        font-weight bold
    .display-bio .text-muted
      font-weight bold

  .crop-image
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%)
    background-position 50%
    background-repeat no-repeat
    border-radius 50%
    width 100px
    height 100px
    overflow hidden
    transition all .5s ease
    &:hover
      width 120px
      height 120px

  .profile-img
    display inline
    margin-left 0 auto
    height 100%
    width auto

  .edit-link
    position fixed
    padding 0
    margin 0
    top 39%
    left 50%
    transform: translate(-50%, -50%)
    text-align center
    a
      color accent-color
</style>
