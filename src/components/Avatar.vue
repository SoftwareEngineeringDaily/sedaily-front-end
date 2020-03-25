<template>
  <img class="avatar" :width="width" :src="avatarUrl" @error="onAvatarError"/>
</template>

<script>

const defaultAvatar = 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'

export default {
  name: 'avatar',
  props: {
    user: {
      type: Object
    },
    width: {
      type: String
    }
  },
  data () {
    return {
      errorImg: ''
    }
  },
  computed: {
    avatarUrl () {
      if (!this.user) return defaultAvatar
      return this.errorImg || this.user.avatarUrl || defaultAvatar
    }
  },
  methods: {
   onAvatarError () {
     this.errorImg = defaultAvatar
   }
  }
}
</script>

<style scoped lang="stylus">
  .avatar
    border-radius  50%
    vertical-align middle
    border-style none
</style>
