<template>
  <div>
    <div class="user-info" v-if="userData">
      <router-link
        :to="'/profile/' + userData._id"
        :style="imageStyle"
        class="avatar" />

      <span v-if="prepend && displayName" class="prepend">
        {{prepend}}
      </span>

      <router-link
        v-if="showName"
        :to="'/profile/' + userData._id"
        class="name">
        {{displayName}}
      </router-link>
    </div>
    <time v-if="dateComment" class="date">{{dateComment}}</time>
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'profile-label',

  props: {
    prepend: {
      type: String,
    },
    userData: {
      type: Object,
      default: function() {
        return {
          _id: '',
          username: '',
          avatarUrl: '',
          name: '',
        };
      }
    },
    showName: {
      type: Boolean,
      required: false,
      default: true
    },
    dateComment: {
      type: String
    }
  },

  computed: {
    ...mapState({
      displayName() {
        return this.userData.name || this.userData.username;
      },
      avatarUrl(state) {
        return this.userData.avatarUrl || state.placeholderAvatar;
      }
    }),
    imageStyle() {
      return `background: url('${
        this.avatarUrl
      }') center center / cover no-repeat`;
    }
  }
};
</script>

<style scoped lang="stylus">
.avatar
  margin-right 10px
  display inline-block
  width 28px
  height 28px
  border-radius 50%

.profile-container
  width 100%

.date
  font-size 0.7rem
  text-transform uppercase
  color #9b9b9b

.name
  font-weight 700

.user-info
  display flex
  align-items center
  justify-content flex-start
  margin-bottom 2px

  p
    margin 0

  span
    margin 0

    &.prepend
      margin-right 0.2rem
      color #9b9b9b

</style>
