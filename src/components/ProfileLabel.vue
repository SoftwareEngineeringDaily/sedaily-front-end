<template>
  <span>
    <router-link :to="'/profile/' + userData._id">
      <div
        :style="imageStyle"
        class="avatar" >
      </div>
    </router-link>

    <span
      v-if="showName"
      class="name">
      <router-link :to="'/profile/' + userData._id">
        {{displayName}}
      </router-link>
    </span>

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
    }),
    imageStyle () {
      return `background: url('${this.avatarUrl}') center center / cover no-repeat`
    }
  }
}
</script>

<style scoped lang="stylus">
  .avatar
    display inline-block
    margin-top -1px
    min-width 25px
    max-width 25px
    min-height 25px
    border-radius 50%

  .name
    margin-left 12px
</style>
