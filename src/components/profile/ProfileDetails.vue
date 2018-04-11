<template>
    <div class="row justify-content-left">
      <h6 v-if="ownProfile" class="col-12 edit-link">
        <router-link :to="'/edit-profile'">
          Edit Profile
        </router-link>
      </h6>
      <div class="col col-sm-auto">
        <img class="profile-img" :src="avatarUrl" />
      </div>
      <div class="col-sm-6 col-md-4">
        <h4>
          {{displayName}}
        </h4>
        <p v-if="userData.website">
          <a :href="userData.website | externalUrl" target="_blank"
             rel="external nofollow"
          > {{ userData.website | host }} </a>
        </p>
        <p>
          <small class="text-muted">{{displayBio}}</small>
        </p>
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
  @import './../../css/variables'
  .profile-details
    padding-top 5px

  .profile-img
    width 100px

  .edit-link
    a
      color accent-color
</style>
