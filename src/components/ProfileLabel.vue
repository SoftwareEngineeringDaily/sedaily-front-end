<template>
  <span>
    <router-link :to="'/profile/' + userData._id">
      <img :src='avatarUrl' class='avatar'/>
    </router-link>
    <span v-if="showName" class="name">{{displayName}}</span>
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
    margin-top 1px
    min-width 25px
    max-width 25px
    min-height 25px
    border-radius 50%
    margin-right 5px
  .name
    margin-left 12px
</style>
