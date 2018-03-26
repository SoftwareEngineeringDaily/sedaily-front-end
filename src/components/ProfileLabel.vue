<template>
  <span>
    <router-link :to="'/profile/' + userData._id">
      <img :src='avatarUrl' class='avatar'/>
    </router-link>
    <span v-if="showName">{{displayName}}</span>
    <slot></slot>
  </span>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'profile-label',
    props: {
      userData: {
        type: Object,
        default: function () {
          return {
            _id: '',
            username: '',
            avatarUrl: '',
            name: ''
          }
        }
      },
      showName: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    computed: {
      ...mapState({
        displayName () {
          return this.userData.name || this.userData.username
        },
        avatarUrl (state) {
          return this.userData.avatarUrl || state.placeholderAvatar
        }
      })
    }
  }
</script>

<style scoped lang="stylus">
  .avatar
    min-width 50px
    max-width 50px
    min-height 50px
    border-radius 50%
</style>
