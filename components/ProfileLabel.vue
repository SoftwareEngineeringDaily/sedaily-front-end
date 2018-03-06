<template>
  <span>
    <nuxt-link :to="'/profile/public/' + userData._id">
      <img
        :src="avatarUrl"
        class="avatar" >
    </nuxt-link>
    {{ displayName }}
    <slot />
  </span>
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
          name: ''
        }
      }
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
    width 50px
</style>
