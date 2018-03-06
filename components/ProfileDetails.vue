<template>
  <div class="row justify-content-left">
    <h6
      v-if="ownProfile"
      class="col-12 edit-link">
      <nuxt-link to="/profile/edit">
        Edit Profile
      </nuxt-link>
    </h6>
    <div class="col col-sm-auto">
      <img
        :src="avatarUrl"
        class="profile-img">
    </div>
    <div class="col-sm-6 col-md-4">
      <h4>
        {{ displayName }}
      </h4>
      <div v-if="userData.website">
        <a
          :href="userData.website | externalUrl"
          target="_blank"
          rel="external nofollow"
        > {{ userData.website | host }} </a>
      </div>
      <div>
        <small class="text-muted">{{ displayBio }}</small>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
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
        avatarUrl (state) {
          return this.userData.avatarUrl || state.placeholderAvatar
        }
      }),
      displayName () {
        return this.userData.name || this.userData.username
      },
      displayBio () {
        return this.userData.bio || `${this.displayName} is still writing their biography`
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../assets/stylus/variables'
  .profile-details
    padding-top 5px

  .profile-img
    width 100px

  .edit-link
    a
      color accent-color
</style>
