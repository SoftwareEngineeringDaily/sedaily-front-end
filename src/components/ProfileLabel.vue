<template>
  <span class="user-info" v-if="userData">
    <router-link :to="'/profile/' + userData._id">
      <div :style="imageStyle" class="avatar"></div>
    </router-link>

    <div class="profile-container">
      <span v-if="showName" class="name">
        <router-link :to="'/profile/' + userData._id">{{displayName}}</router-link>
      </span>
      <span>
        <p>{{dateComment}}</p>
      </span>
    </div>
    <slot></slot>
  </span>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "profile-label",
  props: {
    userData: {
      type: Object,
      default: function() {
        return {
          _id: "",
          username: "",
          avatarUrl: "",
          name: ""
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
.avatar {
  margin: 10px;
  display: inline-block;
  min-width: 25px;
  max-width: 25px;
  min-height: 25px;
  border-radius: 50%;
}

.profile-container {
  width: 100%;
}

.user-info
  display flex
  align-items center
  justify-content flex-start
  p
    margin 0
  span
    margin 0

.name {
  margin-left: 12px;
}
</style>
